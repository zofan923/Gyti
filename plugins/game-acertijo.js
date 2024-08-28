import fs from 'fs';

const timeout = 60000; // المهلة الزمنية
const poin = 500; // النقاط
const handler = async (m, { conn, usedPrefix }) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const tradutor = _translate.plugins.game_acertijo;

  conn.tekateki = conn.tekateki ? conn.tekateki : {};
  const id = m.chat;
  if (id in conn.tekateki) {
    conn.reply(m.chat, tradutor.texto1, conn.tekateki[id][0]);
    throw false;
  }
  const tekateki = tradutor.texto4;
  /* لإضافة المزيد من الأسئلة، انتقل إلى مجلد اللغة في ملف json للغتك المفضلة،
     وابحث عن "acertijo" بعد النص4، يمكنك إضافة أسئلتك هنا */

  const json = tekateki[Math.floor(Math.random() * tekateki.length)];
  const _clue = json.response;
  const clue = _clue.replace(/[A-Za-z]/g, '_'); // استبدال الحروف
  const caption = `
ⷮ *${json.question}*
${tradutor.texto2[0]} ${(timeout / 1000).toFixed(2)} ثواني
${tradutor.texto2[1]} +${poin} نقاط
`.trim();
  conn.tekateki[id] = [
    await conn.reply(m.chat, caption, m), json,
    poin,
    setTimeout(async () => {
      if (conn.tekateki[id]) await conn.reply(m.chat, `${tradutor.texto3} ${json.response}`, conn.tekateki[id][0]);
      delete conn.tekateki[id];
    }, timeout)
  ];
};

handler.help = ['acertijo'];
handler.tags = ['game'];
handler.command = /^(acertijo|acert|pregunta|adivinanza|tekateki)$/i;
export default handler;
