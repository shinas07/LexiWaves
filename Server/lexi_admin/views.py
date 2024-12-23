from django.shortcuts import render
from rest_framework import generics, status
from tutor.models import Tutor, TutorDetails
from .serializers import TutorDetailsSerializer, StudentListSerializer, TutorListSerializer, TutorRequestSerializer, StudentCourseEnrollmentListSerializer,LanguageSerializer, ApprovedCourseSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import UpdateAPIView
from django.utils import timezone
from .models import Language
from rest_framework import viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from tutor.models import Course
from .models import StudentCourseEnrollment
from tutor.serializers import CourseSerializer
from Community_chat.models import ChatRoom
from django.db.models import Sum, Count,Q
from django.db.models.functions import TruncMonth
from datetime import datetime, timedelta
from .models import AdminRevenue



# Create your views here.


class AdminLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')


        if not email or not password:
            return Response({'error': "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate user
        user = authenticate(request, email=email, password=password)
        if user and user.user_type == 'admin' and user.is_staff:
            # Generate tokens
            refresh = RefreshToken.for_user(user)

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                # 'role':user.user_type,
                'user': {
                'first_name': user.first_name,
                'user_type':user.user_type,
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials or not a staff user"}, status=status.HTTP_400_BAD_REQUEST)


class StudentListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        student = User.objects.filter(user_type='student',is_active = True)
        serializer = StudentListSerializer(student, many=True)
        return Response(serializer.data)
    
# Student Block
class BlockUserView(APIView):
    def post(self, request, studentId):
    # For debugging
        try:
            # Retrieve the user using the studentId from the URL
            user = User.objects.get(id=studentId)
            user.is_active = False  # or set a custom field for blocking
            user.save()

            return Response({"message": "User blocked successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
# Admin Tutor List
class ApprovedTutorListView(APIView):
    permission_classes = [IsAuthenticated]


    def get(self, request):
        tutor = User.objects.filter(user_type='tutor',
        tutor_profile__tutordetails__admin_approved=True)
        serializer = TutorListSerializer(tutor, many=True)
        return Response(serializer.data)
    


class TutorApprovalView(generics.ListAPIView):
    queryset = TutorDetails.objects.all()
    serializer_class = TutorDetailsSerializer

#Admin Tutor request List View
class TutorRequests(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request):
        tutors = User.objects.filter(user_type='tutor', tutor_profile__tutordetails__admin_approved=False) 
        serializer = TutorRequestSerializer(tutors, many=True) 
        return Response(serializer.data)



class TutorRequestDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tutor_id):
        tutor = get_object_or_404(Tutor, user_id=tutor_id)
        tutor_details =  tutor_details = TutorDetails.objects.get(tutor=tutor)
        serializer = TutorDetailsSerializer(tutor_details)
        return Response(serializer.data)


class TutorApprovalUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, tutor_id):
        try:
            tutor = Tutor.objects.get(user__id=tutor_id)
            tutor_details = TutorDetails.objects.get(tutor=tutor)

            if tutor_details.admin_approved:
                return Response({"message": "Tutor is already approved."}, status=status.HTTP_400_BAD_REQUEST)

            approval_status = request.data.get('admin_approved', True)
            tutor_details.admin_approved = approval_status
            tutor_details.approval_date = timezone.now()
            tutor_details.save()
            return Response({"message": "Tutor approval updated successfully."}, status=status.HTTP_200_OK)
        except TutorDetails.DoesNotExist:
            return Response({"message": "Tutor details not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
    
            return Response({"message": "An error occurred while updating tutor approval."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class LanguageCreateView(APIView):
    authentication_classes = [JWTAuthentication] 
    def get(self, request, *args, **kwargs):
        languages = Language.objects.all()          
        serializer = LanguageSerializer(languages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    def post(self, request, *args, **kwargs):
        serializer = LanguageSerializer(data = request.data)
        if serializer.is_valid():
            language = serializer.save()
            chatroom = ChatRoom.objects.create(
                language=language,
                name=f"Community for {language}"
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    


# Ḷisting Approved Courses 
class ApprovedCoursesListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]  
    queryset = Course.objects.filter(is_approved=True) 
    serializer_class = ApprovedCourseSerializer
   

    def get_queryset(self):
        return super().get_queryset()
    
# Listing Enrolled Courses and Student
class EnrolledCoursesListView(generics.ListAPIView):
    queryset = StudentCourseEnrollment.objects.select_related('user', 'course').all()
    serializer_class = StudentCourseEnrollmentListSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        return response  

# Request Courses Count
class NewCourseCountView(APIView):
    def get(self, request):
        new_course_count = Course.objects.filter(is_approved=False).count()
        return Response({'new_course_count': new_course_count}, status=status.HTTP_200_OK)
    
# Request Courses List For Approval
class NewCoursesView(generics.ListAPIView):
    permission_class = [IsAuthenticated]
    serializer_class = CourseSerializer

    def get_queryset(self):
        return Course.objects.filter(is_approved=False)

class CourseApprovalView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_approved = request.data.get('is_approved', instance.is_approved)
        instance.save()
        return Response({'status': 'Course approval status updated.'})

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
class AdminLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refreshToken')
            
            if not refresh_token:
                return Response(
                    {'error': 'Refresh token is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = RefreshToken(refresh_token)
            if not request.user.user_type == 'admin' or not request.user.is_staff:
                return Response(
                    {'error': 'Only admin users can access this endpoint'}, 
                    status=status.HTTP_403_FORBIDDEN
                )

            token.blacklist()

            return Response(
                {
                    'message': 'Successfully logged out',
                    'status': 'success'
                }, 
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {
                    'error': 'Invalid token or token has expired',
                    'details': str(e)
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            current_date = timezone.now()
            start_of_year = current_date.replace(month=1, day=1, hour=0, minute=0, second=0)

            # Get total admin revenue directly from AdminRevenue
            total_admin_revenue = AdminRevenue.objects.aggregate(
                total=Sum('amount')
            )['total'] or 0


            stats = {
                'totalRevenue': float(total_admin_revenue),  # This is now actual admin revenue (10%)
                'totalStudents': User.objects.filter(user_type='student', is_active=True).count(),
                'totalTutors': TutorDetails.objects.filter(tutor__user__user_type='tutor', admin_approved=True).count(),
                'totalCourses': Course.objects.filter(is_approved=True).count(),
            }
            # Get monthly revenue data from AdminRevenue
            revenue_data = AdminRevenue.objects.filter(
                create_at__gte=start_of_year
            ).annotate(
                month=TruncMonth('create_at')
            ).values('month').annotate(
                adminRevenue=Sum('amount')
            ).order_by('month')

            # Format the monthly revenue data
            revenue_by_month = [
                {
                    'month': entry['month'].strftime('%b'),
                    'adminRevenue': float(entry['adminRevenue']),
                    'totalRevenue': float(entry['adminRevenue']) * 10,  # Total course price
                    'tutorRevenue': float(entry['adminRevenue']) * 9,   # 90% goes to tutor
                }
                for entry in revenue_data
            ]

            # Course Enrollment Data
            enrollment_data = Course.objects.filter(
                is_approved=True
            ).annotate(
                students=Count('studentcourseenrollment'),
                completed_students=Count(
                    'studentcourseenrollment',
                    filter=Q(studentcourseenrollment__payment_status='completed')
                )
            ).values('title', 'students', 'completed_students')

            # Calculate completion rate
            course_enrollment_data = []
            for course in enrollment_data:
                if course['students'] > 0:
                    completion_rate = (course['completed_students'] / course['students']) * 100
                else:
                    completion_rate = 0
                
                course_enrollment_data.append({
                    'course': course['title'],
                    'students': course['students'],
                    'completionRate': round(completion_rate, 2)
                })

            # Sort by number of students (descending) and limit to top 5
            course_enrollment_data.sort(key=lambda x: x['students'], reverse=True)
            course_enrollment_data = course_enrollment_data[:5]

            return Response({
                'stats': stats,
                'revenueData': revenue_by_month,
                'enrollmentData': course_enrollment_data
            }, status=status.HTTP_200_OK)

        except Exception as e:

            return Response({
                'error': 'Failed to fetch dashboard statistics',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminReportsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            today = timezone.now()
            current_month_start = today.replace(day=1, hour=0, minute=0, second=0)
            period_start = today - timedelta(days=30)

            # Get admin revenue data
            total_admin_revenue = AdminRevenue.objects.aggregate(
                total=Sum('amount')
            )['total'] or 0

            # Get monthly admin revenue
            monthly_admin_revenue = AdminRevenue.objects.filter(
                create_at__gte=current_month_start
            ).aggregate(
                total=Sum('amount')
            )['total'] or 0

            total_enrollments = StudentCourseEnrollment.objects.filter(
                payment_status='completed'
            ).count()

            # Get top courses with their admin revenue
            top_courses = Course.objects.annotate(
                enrollment_count=Count('studentcourseenrollment', 
                    filter=Q(studentcourseenrollment__payment_status='completed')
                ),
                admin_revenue=Sum('adminrevenue__amount')
            ).order_by('-enrollment_count')[:5]

            # User statistics
            user_stats = {
                'total_students': User.objects.filter(user_type='student').count(),
                'total_tutors': User.objects.filter(user_type='tutor').count(),
                'new_students': User.objects.filter(
                    user_type='student',
                    date_joined__gte=period_start
                ).count(),
                'new_tutors': User.objects.filter(
                    user_type='tutor',
                    date_joined__gte=period_start
                ).count()
            }

            # Payment statistics
            payment_stats = StudentCourseEnrollment.objects.aggregate(
                completed_payments=Count('id', filter=Q(payment_status='completed')),
                pending_payments=Count('id', filter=Q(payment_status='pending'))
            )

            total_payments = payment_stats['completed_payments'] + payment_stats['pending_payments']
            success_rate = (
                (payment_stats['completed_payments'] / total_payments * 100)
                if total_payments > 0 else 0
            )

            return Response({
                'financial': {
                    'total_revenue': float(total_admin_revenue ),  # Total course revenue
                    'monthly_revenue': float(monthly_admin_revenue),  # Monthly course revenue
                    'admin_commission': float(total_admin_revenue),  # Actual admin revenue (10%)
                    'total_enrollments': total_enrollments
                },
                'courses': [{
                    'title': course.title,
                    'enrollments': course.enrollment_count,
                    'revenue': float(course.admin_revenue or 0), 
                    'tutor': course.tutor.email
                } for course in top_courses],
                'users': user_stats,
                'payments': {
                    'completed': payment_stats['completed_payments'],
                    'pending': payment_stats['pending_payments'],
                    'success_rate': round(success_rate, 1)
                }
            })

        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminRevenueView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,reqeust):
        try:
            total_admin_revenue = AdminRevenue.objects.aggregate(
                total=Sum('amount')
            )['total'] or 0

            # Get total active students
            total_students = User.objects.filter(
                user_type='student',
                is_active=True
            ).count()

            total_enrollments = StudentCourseEnrollment.objects.filter(payment_status='completed').count()

            # Get transaction history
            transactions = AdminRevenue.objects.select_related(
                'course',
                'course__tutor'
            ).order_by('-create_at')

            # Format transaction data
            transaction_data = []
            for transaction in transactions:
                transaction_data.append({
                    'id': str(transaction.id),
                    'courseName': transaction.course.title,
                    'user': transaction.course.tutor.first_name,  # or full name
                    'purchaseDate': transaction.create_at.strftime('%Y-%m-%d'),
                    'revenue': float(transaction.amount),
                    'status': 'Completed'
                })

            response_data = {
                'totalRevenue': float(total_admin_revenue),
                'totalTransactions': len(transaction_data),
                'totalStudents': total_students,
                'transactions': transaction_data,
                'totalEnrollments' : total_enrollments
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': 'Failed to fetch revenue details'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )