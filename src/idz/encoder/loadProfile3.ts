import iconv = require("iconv-lite");

import { bitmap } from "./_bitmap";
import { car } from "./_car";
import { chara } from "./_chara";
import { mission } from "./_mission";
import { LoadProfileResponse3 } from "../response/loadProfile";

export function loadProfile3(res: LoadProfileResponse3) {
  const buf = Buffer.alloc(0x0ea0);

  // Initialize all TA grades to uhh... fuck knows
  buf.fill(0xff, 0x07e4, 0x080c);

  for (const score of res.timeAttack) {
    const { routeNo } = score;

    buf.writeUInt32LE(
      (new Date(score.timestamp).getTime() / 1000) | 0, // Date ctor hack
      0x00e4 + routeNo * 4
    );

    buf.writeUInt16LE(0, 0x067c + 2 * routeNo); // ???
    buf.writeUInt16LE(0xffff, 0x0184 + 2 * routeNo); // National rank
    buf.writeUInt32LE((score.totalTime * 1000) | 0, 0x00e4 + 4 * routeNo);
    buf.writeUInt8(score.flags, 0x06cc + routeNo);
    buf.writeUInt8(score.grade, 0x07e4 + routeNo);

    for (let i = 0; i < 3; i++) {
      buf.writeUInt16LE(
        (score.sectionTimes[i] * 1000) >> 2,
        0x06f4 + 6 * routeNo + 2 * i
      );
    }
  }

  for (let i = 0; i < 9 && i < res.story.rows.length; i++) {
    const row = res.story.rows[i];
    const rowOffset = 0x0256 + i * 0x26;

    for (let j = 0; j < 9 && j < row.cells.length; j++) {
      const cell = row.cells[j];
      const cellOffset = rowOffset + j * 4;

      buf.writeUInt16LE(cell.a, cellOffset + 0);
      buf.writeUInt16LE(cell.b, cellOffset + 2);
    }
  }

  for (const [courseId, playCount] of res.coursePlays.entries()) {
    if (courseId < 0 || courseId >= 20) {
      throw new Error(`Course id out of range: ${courseId}`);
    }

    buf.writeUInt16LE(playCount, 0x053c + 2 * courseId);
  }

  const { freeCar, freeContinue } = res.tickets;

  if (freeCar) {
    buf.writeUInt32LE((freeCar.validFrom.getTime() / 1000) | 0, 0x0214);
  }

  if (freeContinue) {
    buf.writeUInt32LE((freeContinue.validFrom.getTime() / 1000) | 0, 0x04b8);
    buf.writeUInt32LE((freeContinue.validTo.getTime() / 1000) | 0, 0x04bc);
  }

  buf.writeUInt16LE(0x012e, 0x0000);
  buf.writeUInt8(res.unlocks.cup, 0x00b4);
  buf.writeUInt16LE(res.unlocks.gauges, 0x00b8);
  buf.writeUInt32LE(res.unlocks.lastMileageReward, 0x0218);
  buf.writeUInt16LE(res.unlocks.music, 0x021c);
  buf.writeUInt16LE(0, 0x0456); // Team leader
  mission(res.missions.team).copy(buf, 0x0460);
  buf.writeUInt16LE(0xffff, 0x0462); // [1]
  buf.writeUInt32LE(res.profileId, 0x0494);
  buf.writeUInt32LE(res.mileage, 0x0498);
  buf.writeUInt16LE(res.settings.music, 0x04a4);
  buf.writeUInt16LE(res.lv, 0x04a8);
  buf.writeUInt32LE(res.exp, 0x04ac);
  buf.writeUInt32LE(res.settings.pack, 0x04b4);
  buf.writeUInt32LE(res.dpoint, 0x04c4);
  buf.writeUInt32LE(res.fame, 0x04e0);
  iconv.encode(res.name + "\0", "shift_jis").copy(buf, 0x04ca);
  buf.writeUInt8(res.story.y, 0x080c);
  buf.writeUInt16LE(res.story.x, 0x0828);
  mission(res.missions.solo).copy(buf, 0x0858);
  chara(res.chara).copy(buf, 0x0880);
  bitmap(res.titles, 0xb4).copy(buf, 0x0894);
  buf.writeUInt8(res.settings.paperCup, 0x094d);
  buf.writeUInt8(res.settings.gauges, 0x094e);
  buf.writeUInt32LE(res.teamId || 0xffffffff, 0x0954);
  buf.writeUInt32LE(res.carCount, 0x0dd0);
  car(res.car).copy(buf, 0x0dd4);

  // [1] Currently unknown, but if this field is zero then the player will have
  //     a "model record" emblem in their profile card.

  return buf;
}
