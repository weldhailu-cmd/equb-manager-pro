import os
import json
import asyncio
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardMarkup, KeyboardButton
from aiogram.client.session.aiohttp import AiohttpSession

TOKEN = "8173763256:AAGnFioCLFGGFRz6BctNR1odMSkTz6WjXpw"
ADMIN_ID = os.getenv("ADMIN_CHAT_ID", "123456789")

# 🌟 የኔትወርክ ታይም አውትን ማሳደጊያ
session = AiohttpSession(timeout=60.0)
bot = Bot(token=TOKEN, session=session)
dp = Dispatcher()

# ከዌብ ዳሽቦርዱ ጋር የሚጋራው የ JSON ፋይል አድራሻ
EQUBS_JSON_PATH = os.path.join(os.path.dirname(__file__), "equbs.json")

def load_equbs_from_file():
    """በዌብ ዳሽቦርድ የተፈጠሩትን እቁቦች ከጋራ JSON ፋይል በቀጥታ ያነባል"""
    if os.path.exists(EQUBS_JSON_PATH):
        try:
            with open(EQUBS_JSON_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list) and len(data) > 0:
                    return data
        except Exception as e:
            print(f"JSON Read Error: {e}")
    return []

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    # የተስተካከሉ እና የተሟሉ ዋና ዋና አዝራሮች
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="📊 እቁብን ይመልከቱ"), KeyboardButton(text="🏆 አሸናፊዎች")],
            [KeyboardButton(text="📸 የደረሰኝ መላኪያ"), KeyboardButton(text="🛒 ማርኬትፕሌይ (Marketplace)")],
            [KeyboardButton(text="🏷️ እጣ መሸጥ"), KeyboardButton(text="🛒 እጣ መግዛት")],
            [KeyboardButton(text="🚀 ወደፊት የሚጀመሩ (Coming Soon)"), KeyboardButton(text="🌐 ቋንቋ / Language")]
        ],
        resize_keyboard=True
    )
    
    # የጠየቅካቸውን ትክክለኛ ስሎጋን እና የ 'ዮጵ' (ቢጫ ወርቅ) ትርጉም የያዘ ዌልካም ቴክስት
    welcome_text = (
        "🌿 **እንኳን ወደ Yop (Yellow Gold) በደህና መጡ!**\n\n"
        "🟡 **Yop (Yellow Gold) — Hub of Prosperity and Savings**\n"
        "«ዮጵ» የሚለው ቃል ትርጉሙ ቢጫ ወርቅ (Yellow Gold) ሲሆን፤ ማህበረሰባችንን በቁጠባ፣ በዕቁብ እና በብልጽግና ለማገናኘት የተፈጠረ ዲጂታል መድረክ ነው።\n\n"
        "ይህ ቦት እቁቦችዎን እንዲከታተሉ፣ ደረሰኝ እንዲልኩ፣ ማርኬትፕሌይን እንዲጠቀሙ እና የዕጣ ውጤቶችን በቅጽበት እንዲከታተሉ ያስችልዎታል።\n\n"
        "👇 ከታች ካሉት አዝራሮች በመምረጥ አገልግሎቱን ማግኘት ይችላሉ:"
    )
    
    await message.answer(
        welcome_text,
        reply_markup=keyboard,
        parse_mode="Markdown"
    )

@dp.message(F.text.contains("እቁብን ይመልከቱ"))
@dp.message(Command("equb"))
async def show_equbs(message: types.Message):
    equbs = load_equbs_from_file()
    
    if not equbs:
        await message.answer("⚠️ በአሁኑ ሰአት በዌብ ዳሽቦርዱ ላይ የተመዘገበ ምንም እቁብ የለም።")
        return

    buttons = []
    for eq in equbs:
        eq_name = eq.get("name") or "Daily 200 ETB Equb"
        eq_id = eq.get("id") or "1"
        buttons.append([
            InlineKeyboardButton(text=f"📌 {eq_name}", callback_data=f"eq_info_{eq_id}")
        ])
    
    markup = InlineKeyboardMarkup(inline_keyboard=buttons)
    await message.answer("📋 **ንቁ የእቁብ ዝርዝሮች (የእቁብ ማስተዳደሪያ):**", reply_markup=markup, parse_mode="Markdown")

@dp.message(F.text.contains("አሸናፊዎች"))
@dp.message(Command("winners"))
async def show_winners_btn(message: types.Message):
    await message.answer(
        "🏆 **የእጣ አሸናፊዎች ማዕከል (Yop.com):**\n\n"
        "• 1ኛ ዙር አሸናፊ፦ አበበ ከበደ (10,000 ብር) - 🟢 ተጠናቀቀ\n"
        "• 2ኛ ዙር አሸናፊ፦ መሳይ ወልዴ (10,000 ብር) - 🟢 ተጠናቀቀ\n\n"
        "🎉 *ዮጵ — የልብ አድርስ አንጀት አርስ!*",
        parse_mode="Markdown"
    )

@dp.message(F.text.contains("የደረሰኝ መላኪያ"))
@dp.message(Command("receipt"))
async def prompt_receipt_btn(message: types.Message):
    await message.answer("📸 እባክዎ የባንክ የክፍያ ማስተላለፊያ (Receipt) ስክሪንሾት ፎቶ በቀጥታ ወደዚህ ቦት ይላኩ። ለአድሚን ማረጋገጫ ወዲያውኑ ይተላለፋል።")

@dp.message(F.text.contains("እጣ መሸጥ"))
@dp.message(Command("sell"))
async def sell_lottery(message: types.Message):
    await message.answer("🏷️ እጣ ለመሸጥ ጥያቄ ለማቅረብ እባክዎ የእቁብዎን ስም እና ዝርዝር መረጃ ይላኩ።")

@dp.message(F.text.contains("እጣ መግዛት"))
@dp.message(Command("buy"))
async def buy_lottery(message: types.Message):
    await message.answer("🛒 ለሽያጭ የቀረቡ እቁቦችን ለመግዛት የሚፈልጉትን አማራጭ ይምረጡ።")

@dp.message(F.text.contains("ማርኬትፕሌይ"))
@dp.message(Command("marketplace"))
async def marketplace_menu(message: types.Message):
    await message.answer(
        "🛒 **Yop.com ማርኬትፕሌይ (Marketplace):**\n\n"
        "እዚህ ጋር የተለያዩ ንግዶች፣ ምርቶች እና ማስታወቂያዎች ይስተናገዳሉ።\n\n"
        "📌 ሙሉ አገልግሎቶች በቅርቡ በድር-ገጹ በኩል ይለቀቃሉ!"
    )

@dp.message(F.text.contains("ወደፊት የሚጀመሩ"))
@dp.message(Command("comingsoon"))
async def coming_soon_menu(message: types.Message):
    await message.answer(
        "🚀 **ወደፊት የሚጀመሩ አገልግሎቶች (Coming Soon):**\n\n"
        "• የላቀ የዲጂታል ሎተሪ ስርዓቶች\n"
        "• አውቶማቲክ የባንክ API ትስስር\n"
        "• የንግድ ማስተዋወቂያ ማዕከላት"
    )

@dp.message(F.text.contains("ቋንቋ") | F.text.contains("Language"))
@dp.message(Command("language"))
async def change_language(message: types.Message):
    await message.answer("🌐 ቋንቋ ለመቀየር፦ አማርኛ / English")

@dp.message(F.photo)
async def handle_screenshot(message: types.Message):
    user_id = message.from_user.id
    photo = message.photo[-1]
    
    admin_markup = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="✅ አረጋግጥ (Approve)", callback_data=f"app_{user_id}"),
            InlineKeyboardButton(text="❌ ውድቅ አድርግ (Reject)", callback_data=f"rej_{user_id}")
        ]
    ])
    
    try:
        await bot.send_photo(
            chat_id=ADMIN_ID,
            photo=photo.file_id,
            caption=f"💳 **አዲስ የክፍያ ስክሪንሾት ደርሷል!**\n\nየላከው ሰው ID: `{user_id}`",
            reply_markup=admin_markup,
            parse_mode="Markdown"
        )
        await message.reply("✅ ስክሪንሾትዎ ለአድሚን ተልኳል። ሲረጋገጥ እናሳውቆታለን።")
    except Exception as e:
        print(f"Error forwarding to admin: {e}")
        await message.reply("⚠️ ስክሪንሾቱን መላክ አልተቻለም። እባክዎ ቆይተው እንደገና ይሞክሩ።")

# 🟢 የአድሚኑን ውሳኔ (Approve/Reject) ማስተናገጃ Callback Handler (የተጨመረ)
@dp.callback_query(F.data.startswith("app_") | F.data.startswith("rej_"))
async def handle_admin_approval(callback: types.CallbackQuery):
    action, user_id = callback.data.split("_")
    user_chat_id = int(user_id)

    if action == "app":
        try:
            await bot.send_message(
                chat_id=user_chat_id,
                text="🎉 **ክፍያዎ ተረጋግጧል!**\n\nየላኩት የክፍያ ስክሪንሾት በአድሚኑ ተረጋግጦ በእቁቡ ውድድር ውስጥ ተመዝግበዋል። መልካም ዕድል! 🌿",
                parse_mode="Markdown"
            )
            await callback.message.edit_caption(
                caption=callback.message.caption + "\n\n✅ **ሁኔታ፦ አድሚኑ አረጋግጦታል (Approved)**"
            )
            await callback.answer("ክፍያው በስኬት ተረጋገጠ!", show_alert=True)
        except Exception as e:
            await callback.answer(f"ስህተት፦ {e}", show_alert=True)

    elif action == "rej":
        try:
            await bot.send_message(
                chat_id=user_chat_id,
                text="⚠️ **የክፍያ ማረጋገጫ ስህተት!**\n\nየላኩት የክፍያ ስክሪንሾት ትክክለኛ ባለመሆኑ ውድቅ ተደርጓል። እባክዎ ትክክለኛውን ደረሰኝ በድጋሚ ይላኩ።",
                parse_mode="Markdown"
            )
            await callback.message.edit_caption(
                caption=callback.message.caption + "\n\n❌ **ሁኔታ፦ ውድቅ ተደርጓል (Rejected)**"
            )
            await callback.answer("ክፍያው ውድቅ ተደርጓል!", show_alert=True)
        except Exception as e:
            await callback.answer(f"ስህተት፦ {e}", show_alert=True)

async def main():
    print("🤖 የቴሌግራም ቦቱ በስራ ላይ ውሏል (t.me/YopEqubBot)...")
    while True:
        try:
            await dp.start_polling(bot)
        except Exception as e:
            print(f"Network error encountered: {e}. Retrying in 5 seconds...")
            await asyncio.sleep(5)
            