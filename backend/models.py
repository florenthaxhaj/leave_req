from werkzeug.security import generate_password_hash, check_password_hash

class User:
    def __init__(self, username, password, role):
        self.username = username
        self.password_hash = generate_password_hash(password)
        self.role = role

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class PushimiRequest:
    def __init__(self, employee, start_date, end_date, days, status='pending'):
        self.employee = employee
        self.start_date = start_date
        self.end_date = end_date
        self.days = days
        self.status = status

