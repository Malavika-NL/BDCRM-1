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

    def allow_relation(self, obj1, obj2, **hints):
        model_1_is_contact = self._is_contact_model(obj1._meta.model)
        model_2_is_contact = self._is_contact_model(obj2._meta.model)

        # Contacts live behind a dedicated DB alias, but in this project both aliases
        # point to the same physical database. Allow relations so CRM planner models
        # can reference Contact rows without Django blocking the assignment.
        if model_1_is_contact or model_2_is_contact:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        # Django supplies `model_name` during normal migrations rather than a
        # model object in `hints`. Route the Contact schema to contacts_db so
        # fields such as Contact.created_by are created on the table used by
        # the Contact API.
        if model_name == 'contact' or (hints.get('model') and self._is_contact_model(hints['model'])):
            return db == 'contacts_db'
        return None
