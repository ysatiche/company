# -*- coding: UTF-8 -*-
from app import db
# pip install flask-sqlalchemy
# pip install mysql-python

class NovelList(db.Model):
  __tablename__ = 'novelList'
  novel_id = db.Column(db.Integer, primary_key=True)
  novel_name = db.Column(db.String(64), index=True)
  novel_author= db.Column(db.String(64), index=True)
  novel_cover_img_url = db.Column(db.String(64))
  novel_origin = db.Column(db.String(64))
  novel_origin_url = db.Column(db.String(64))
  novel_desciption = db.Column(db.String(64))
  novel_class = db.Column(db.String(64))
  novel_process = db.Column(db.String(64))

class NovelChapter(db.Model):
  __tablename__ = 'novelChapter'
  chapter_id = db.Column(db.Integer, primary_key=True)
  novel_id = db.Column(db.Integer, index=True)
  chapter_name = db.Column(db.String(64))
  chapter_content = db.Column(db.String(2264))
  chapter_index = db.Column(db.Integer)