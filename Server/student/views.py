from django.shortcuts import render
from tutor.models import Course
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication

from rest_framework import status,generics, viewsets
from accounts.serializers import CourseSerializer
from tutor.models import Lesson
from .models import UserLesson,StudyStreak
from .serializers import UserLessonSerializer, TutorSerializer, TutorProfileShowingSerializer,TutorInteractionSerializer,StreakSerializer,StudeyActivitySerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from tutor.models import Question,QuizAttempt,Answer
from tutor.serializers import QuestionSerializer
from django.shortcuts import get_object_or_404
from accounts.models import User
from tutor.models import Tutor, TutorDetails
from lexi_admin.models import StudentCourseEnrollment
from lexi_admin.serializers import StudentCourseEnrollmentListSerializer
from .learning_streak_service import StreakService


#Home Page Latest courses
class LatestCoursesView(generics.ListAPIView):
    def get(self, request, *args, **kwargs):
        courses  = Course.objects.filter(is_approved=True)
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# Quiz related funtions
class MarkLessonWatchedView(APIView):
    # authentication_classes = [TokenAuthentication]
    permission_class = [IsAuthenticated]

    def post(self, request):
        user = request.user
        lesson_id = request.data.get('lesson_id')
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            user_lesson, created = UserLesson.objects.get_or_create(user=user, lesson=lesson)
            user_lesson.watched = True
            user_lesson.save()
            return Response({'message': 'Lesson marked as watched successfully'}, status=status.HTTP_200_OK)
        except Lesson.DoesNotExist:
            return Response({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class CompletedLessonsView(APIView):
    # authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            # Get the course
            course = Course.objects.get(id=course_id)
            

            completed_lessons = UserLesson.objects.filter(
                user=request.user,
                lesson__course=course,
                watched=True
            ).values_list('lesson_id', flat=True)

            return Response({
                'status': 'success',
                'completed_lessons': list(completed_lessons)
            })

        except Course.DoesNotExist:
            return Response({'status': 'error','message': 'Course not found'}, status=404)
        except Exception as e:
            return Response({'status': 'error','message': str(e)}, status=500)


class QuizView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        """Fetch quiz questions for a course"""
        try:
            # Get course and verify it exists
            course = get_object_or_404(Course, id=course_id)
            
            # Check if user has completed all lessons
            completed_lessons = course.lessons.filter(
                lessoncompletion__user=request.user
            ).count()
            total_lessons = course.lessons.count()

            if completed_lessons < total_lessons:
                return Response({
                    'error': 'Please complete all lessons before taking the quiz'
                }, status=status.HTTP_403_FORBIDDEN)

            # Check if user has already passed the quiz
            previous_attempt = QuizAttempt.objects.filter(
                user=request.user,
                course=course,
                passed=True
            ).exists()

            if previous_attempt:
                return Response({
                    'message': 'You have already passed this quiz'
                }, status=status.HTTP_200_OK)

            # Fetch questions with answers
            questions = Question.objects.filter(course_id=course_id).prefetch_related('answers')
            # Format questions and answers (excluding correct answer flags)
            formatted_questions = []
            for question in questions:
                formatted_questions.append({
                    'id': question.id,
                    'text': question.text,
                    'answers': [
                        {'id': answer.id, 'text': answer.text}
                        for answer in question.answers.all()
                    ]
                })

            return Response({
                'course_id': course_id,
                'questions': formatted_questions
            }, status=status.HTTP_200_OK)

        except Course.DoesNotExist:
            return Response({
                'error': 'Course not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, course_id):
        """Submit and validate quiz answers"""
        try:
            # Validate input
            if not request.data.get('answers'):
                return Response({
                    'error': 'No answers provided'
                }, status=status.HTTP_400_BAD_REQUEST)

            course = get_object_or_404(Course, id=course_id)
            user_answers = request.data.get('answers')
            
            # Get all questions for this course
            questions = Question.objects.filter(
                course_id=course_id
            ).prefetch_related('answers')

            if not questions.exists():
                return Response({
                    'error': 'No questions found for this course'
                }, status=status.HTTP_404_NOT_FOUND)

            # Calculate score
            total_questions = questions.count()
            correct_answers = 0

            for question in questions:
                user_answer_id = user_answers.get(str(question.id))
                if user_answer_id:
                    is_correct = Answer.objects.filter(
                        id=user_answer_id,
                        question=question,
                        is_correct=True
                    ).exists()
                    if is_correct:
                        correct_answers += 1

            # Calculate percentage
            score = (correct_answers / total_questions) * 100
            passed = score >= 70  # 70% passing threshold

            # Save quiz attempt
            QuizAttempt.objects.create(
                user=request.user,
                course=course,
                score=score,
                passed=passed
            )

            # Prepare detailed response
            response_data = {
                'score': score,
                'passed': passed,
                'total_questions': total_questions,
                'correct_answers': correct_answers,
                'message': 'Congratulations! You passed the quiz!' if passed 
                          else 'Keep practicing and try again.',
                'feedback': []
            }

            # Add detailed feedback for each question
            for question in questions:
                user_answer_id = user_answers.get(str(question.id))
                correct_answer = question.answers.filter(is_correct=True).first()
                
                response_data['feedback'].append({
                    'question': question.text,
                    'correct': user_answer_id and Answer.objects.filter(
                        id=user_answer_id,
                        is_correct=True
                    ).exists(),
                    'correct_answer': correct_answer.text if correct_answer else None
                })

            return Response(response_data, status=status.HTTP_200_OK)

        except Course.DoesNotExist:
            return Response({
                'error': 'Course not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Course Enrolled Student Details
class CourseEnrolledStudentsView(APIView):
    # authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Fetch enrolled courses for the authenticated user
        enrollments = StudentCourseEnrollment.objects.filter(user=request.user).select_related('course')
        serializer = StudentCourseEnrollmentListSerializer(enrollments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# Student Intraction with Tutor
class TutorDetailByCourseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tutor_id):
        try:
            # Fetch the tutor (User) by tutor_id
            tutor = User.objects.get(id=tutor_id)
        
            # Serialize the tutor data
            serializer = TutorInteractionSerializer(tutor)
            
            return Response(serializer.data, status=200)
        
        except User.DoesNotExist:
            return Response({"error": "Tutor not found"}, status=404)

# Student Study streak
class StudyStreakViewSet(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StreakSerializer
    
    def get(self,request):
        streak, created = StudyStreak.objects.get_or_create(
            user=request.user,
            defaults={'current_streak': 0,
                'max_streak': 0,
                'total_study_days': 0,
                'last_study_date': None}
            )
        serializer = self.serializer_class(streak)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    def post(self, request):
        course_id = request.data.get('course_id')
        duration = request.data.get('duration')
        print(course_id, duration)

        if not all([course_id, duration]):
            return Response({'error':'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            course = Course.objects.get(id=course_id)
            streak = StreakService.update_streak(request.user, course, duration)
            return Response(StreakSerializer(streak).data)
        except Course.DoesNotExist:
            return Response({'error':'Course not found'}, status=status.HTTP_404_NOT_FOUND)
