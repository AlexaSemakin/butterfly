import os
import sys
sys.path.append(os.getcwd())

import telebot

from backend.config import TELEGRAM_TOKEN, TELEGRAM_GROUP_ID

from backend.database import SessionLocal
from backend import models

bot = telebot.TeleBot(TELEGRAM_TOKEN)
db = SessionLocal()


@bot.message_handler(content_types=[
    "new_chat_members"
])
def new_member(message):
    user_id = message.new_chat_members[0].id
    user_name = message.new_chat_members[0].username
    print(user_id)
    print(user_name)
    person = db.query(models.Person).filter(models.Person.telegram == user_name).first()
    if person is None:
        bot.reply_to(message, "Пользователь не обнаружен в базе.")
        bot.kick_chat_member(chat_id=TELEGRAM_GROUP_ID, user_id=user_id)
        return
    person.telegram_id = user_id
    db.add(person)
    db.commit()
    bot.reply_to(message, "Новый участник зафиксирован.")


if __name__ == '__main__':
    bot.polling()
    print('Check')
