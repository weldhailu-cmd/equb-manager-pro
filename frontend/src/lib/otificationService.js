// frontend/src/lib/notificationService.js

/**
 * የዕጣ አሸናፊ መልእክት ኤስኤምኤስ እና ቴሌግራም መላኪያ Utility
 */

// 1. የመልእክት ቴምፕሌት ማዘጋጃ
export const generateWinnerMessage = ({
  winnerName,
  equbName,                     // ዳይናሚክ የዕቁቡ ስም
  totalAmount,                   // ጠቅላላ የወጣው ዕጣ
  serviceFeePercent = 0.006,     // 0.6% የአገልግሎት ክፍያ (ከ10,000 ብር ላይ 60 ብር)
  winnerAccountNo = "",          // የአባሉ የባንክ ሂሳብ ቁጥር
  bankName = "ፀደይ ባንክ",          // የባንኩ ስም
  contactPhone = "0917175800"    // ያንተ የስልክ ቁጥር
}) => {
  // የ0.6% አገልግሎት ክፍያ ስሌት (ከ10,000 ብር ላይ 60 ብር)
  const serviceFee = Math.round(totalAmount * serviceFeePercent);
  const netPayout = totalAmount - serviceFee;

  let accountText = "";
  if (winnerAccountNo) {
    accountText = `• ገንዘቡ ገቢ የሚደረግበት ሂሳብ ቁጥር: ${winnerAccountNo} (${bankName})\n`;
  } else {
    accountText = `• ገንዘብዎ በ ${bankName} ሂሳብ ቁጥርዎ ገቢ ይደረግልዎታል።\n`;
  }

  return `እንኳን ደስ አለዎት ${winnerName}! 🥳\n\n` +
    `በ "${equbName}" እቁብ የእለቱ የዕጣ አሸናፊ ሆነዋል።\n` +
    `• ጠቅላላ ዕጣ: ${totalAmount.toLocaleString()} ETB\n` +
    `• የአገልግሎት ክፍያ (0.6%): ${serviceFee.toLocaleString()} ETB\n` +
    `• የተጣራ የሚከፈልዎ: ${netPayout.toLocaleString()} ETB\n\n` +
    accountText +
    `ለበለጠ መረጃ ወይም ጥያቄ ካለዎት በ ${contactPhone} ይደውሉልን።\n\n` +
    `ስለተጠቀሙ እናመሰግናለን! — Yop Digital Equb`;
};

// 2. በስልክ ኤስኤምኤስ (SMS Direct) መላኪያ
export const sendSMSNotification = (phone, messageData) => {
  if (!phone) {
    alert("⚠️ የአባሉ የስልክ ቁጥር አልተገኘም!");
    return;
  }
  const message = generateWinnerMessage(messageData);
  const smsUrl = `sms:${phone}?body=${encodeURIComponent(message)}`;
  window.location.href = smsUrl;
};

// 3. በቴሌግራም (Telegram Direct DM) መላኪያ
export const sendTelegramNotification = (telegramUsername, messageData) => {
  if (!telegramUsername) {
    alert("⚠️ የአባሉ የቴሌግራም ዩዘርኔም አልተገኘም!");
    return;
  }
  const message = generateWinnerMessage(messageData);
  const cleanUsername = telegramUsername.replace('@', '');
  const tgUrl = `https://t.me/${cleanUsername}?text=${encodeURIComponent(message)}`;
  window.open(tgUrl, '_blank');
};