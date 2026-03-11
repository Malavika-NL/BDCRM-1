from whatsapp_api_client_python import API
from django.conf import settings

def send_whatsapp_message(phone, message_text):
    """
    Sends a WhatsApp message using Green API and returns a dictionary.
    """
    try:
        # 1. Initialize Green API
        greenAPI = API.GreenAPI(settings.GREEN_API_ID, settings.GREEN_API_TOKEN)
        
        # 2. Clean the phone number (remove +, spaces, dashes)
        clean_phone = str(phone).replace('+', '').replace(' ', '').replace('-', '')
        chat_id = f"{clean_phone}@c.us"
        
        # 3. Send the message
        response = greenAPI.sending.sendMessage(
            chatId=chat_id,
            message=message_text
        )
        
        # 4. Return exactly what views.py expects!
        if response.code == 200:
            return {"success": True, "message_id": response.data.get("idMessage")}
        else:
            return {"success": False, "error": str(response.data)}
            
    except Exception as e:
        print(f"Failed to send message to {phone}: {str(e)}")
        # Return False instead of crashing so the view can handle it
        return {"success": False, "error": str(e)}