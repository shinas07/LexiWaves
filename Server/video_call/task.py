from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from .models import VideoCallRequest
from datetime import timedelta


@shared_task
def send_video_call_emails(video_request_id):
    try:
        # Get the video request
        video_request = VideoCallRequest.objects.get(id=video_request_id)
        
        # Prepare context
        context = {
            'student_name': video_request.student.first_name,
            'tutor_name': video_request.tutor.first_name,
            'course_name': video_request.course.title,
            'scheduled_time': video_request.scheduled_time.strftime("%B %d, %Y at %I:%M %p"),
            'join_link': f"{settings.FRONTEND_URL}/video-call-room/{video_request.id}",
            'calendar_link': generate_calendar_link(video_request)
        }

        # Send student email
        student_html = render_to_string('video_call_scheduled_student.html', context)
        student_text = render_to_string('video_call_scheduled_student.txt', context)
        
        send_mail(
            subject='Your Video Call Session Has Been Scheduled',
            message=student_text,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[video_request.student.email],
            html_message=student_html
        )

        # Send tutor email
        tutor_html = render_to_string('video_call_scheduled_tutor.html', context)
        tutor_text = render_to_string('video_call_scheduled_tutor.txt', context)
        
        send_mail(
            subject='Video Call Session Scheduled',
            message=tutor_text,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[video_request.tutor.email],
            html_message=tutor_html
        )

        return f"Emails sent successfully for video call request {video_request_id}"
    
    except VideoCallRequest.DoesNotExist:
        return f"Video call request {video_request_id} not found"
    except Exception as e:
        return f"Error sending emails: {str(e)}"
    
    
def generate_calendar_link(video_request):
    """Generate Google Calendar event link"""
    
    start_time = video_request.scheduled_time.strftime("%Y%m%dT%H%M%SZ")
    end_time = (video_request.scheduled_time + timedelta(hours=1)).strftime("%Y%m%dT%H%M%SZ")
 
    
    event_details = {
        'text': f"Video Call Session: {video_request.course.title}",
        'dates': f"{start_time}/{end_time}",
        'details': f"Video call session with {video_request.tutor.first_name} for {video_request.course.title}",
        'location': f"{settings.FRONTEND_URL}/video-call-room/{video_request.id}"
    }
    
    return f"https://calendar.google.com/calendar/render?action=TEMPLATE&text={event_details['text']}&dates={event_details['dates']}&details={event_details['details']}&location={event_details['location']}"