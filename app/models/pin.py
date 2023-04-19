from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import ForeignKey


class Pin(db.Model):
    __tablename__ = 'pins'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    image_url = db.Column(db.Text, nullable=False)
    title = db.Column(db.String(40), nullable=False)
    description = db.Column(db.String(255))
    user_id = db.Column(db.Integer, ForeignKey(add_prefix_for_prod('users.id')))

    user = db.relationship('User', back_populates='pins')

    boards = db.relationship('Board', secondary='board_pins', back_populates='pins')

    def to_dict(self):
        return {
            'id': self.id,
            'imageUrl': self.image_url,
            'title': self.title,
            'description': self.description,
            'user_id': self.user_id
        }
