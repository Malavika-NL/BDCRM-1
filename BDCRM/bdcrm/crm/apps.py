from django.apps import AppConfig

class CrmConfig(AppConfig): # 'Crm' or whatever your app name is
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'crm' # Ensure this matches your folder name

    def ready(self):
        import crm.signals 