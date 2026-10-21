import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command

# 🌟 ትክክለኛው የቦት ቶክን (Token)
TOKEN = "8173763256:AAGnFioCLFGGFRz6BctNR1odMSkTz6WjXpw"

# የ Vercel ማሰማራሪያ ሊንክህ
WEB_APP_URL = "https://equb-manager-pro.vercel.app"

async def start_command(message: types.Message):
    # ሚኒ አፑን የሚከፍቱ ቋሚ Inline Buttons
    builder = types.InlineKeyboardMarkup(
        inline_keyboard=[
            [
                types.InlineKeyboardButton(
                    text="🚀 ዮጵ ዲጂታል እቁብ አፕሊኬሽን ክፈት",
                    web_app=types.WebAppInfo(url=WEB_APP_URL)
                )
            ],
            [
                types.InlineKeyboardButton(
                    text="📊 እቁብ ይመልከቱ",
                    web_app=types.WebAppInfo(url=WEB_APP_URL)
                ),
                types.InlineKeyboardButton(
                    text="🏆 አሸናፊዎች",
                    web_app=types.WebAppInfo(url=WEB_APP_URL)
                )
            ],
            [
                types.InlineKeyboardButton(
                    text="📤 ደረሰኝ መላኪያ",
                    web_app=types.WebAppInfo(url=WEB_APP_URL)
                ),
                types.InlineKeyboardButton(
                    text="🛒 ማርኬትፕሌስ",
                    web_app=types.WebAppInfo(url=WEB_APP_URL)
                )
            ]
        ]
    )
    
    welcome_text = (
        "✨ **እንኳን ወደ ዮጵ ዲጂታል ዕቁብ (Yop Digital Equb) በሰላም መጡ!**\n\n"
        "ይህ ስርዓት የዕቁብ አባላትን ክፍያ፣ የዕጣ ማውጫ መርሃ ግብር እና "
        "የንብረት ማስታወቂያዎችን (Marketplace) በቀላሉ እንዲከታተሉ የሚያስችል "
        "የዲጂታል ዕቁብ አስተዳደር ስርዓት ነው።\n\n"
        "👇 ከታች ያሉትን አዝራሮች በመጫን የሚፈልጉትን አገልግሎት ማግኘት ይችላሉ!"
    )
    
    await message.answer(
        welcome_text,
        reply_markup=builder,
        parse_mode="Markdown"
    )

async def main():
    logging.basicConfig(level=logging.INFO)
    bot = Bot(token=TOKEN)
    dp = Dispatcher()
    
    dp.message.register(start_command, Command(commands=["start"]))
    
    print("🤖 የቴሌግራም ቦቱ (YopEqubBot) በስኬት ስራ ጀምሯል...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())