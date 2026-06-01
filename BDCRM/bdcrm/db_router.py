class ContactRouter:
    CONTACT_TABLES = {"contacts", "email_campaign_contact"}

    def _is_contact_model(self, model):
        return model._meta.model_name == "contact" or model._meta.db_table in self.CONTACT_TABLES

    def db_for_read(self, model, **hints):
        if self._is_contact_model(model):
            return 'contacts_db'
        return None

    def db_for_write(self, model, **hints):
        if self._is_contact_model(model):
            return 'contacts_db'
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if hints.get('model') and self._is_contact_model(hints['model']):
            return db == 'contacts_db'
        return None
