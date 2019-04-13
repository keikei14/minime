import { _team } from "./_team";
import { checkTeamName } from "./checkTeamName";
import { createProfile } from "./createProfile";
import { createTeam } from "./createTeam";
import { discoverProfile } from "./discoverProfile";
import { load2on2 } from "./load2on2";
import { loadConfig } from "./loadConfig";
import { loadConfig2 } from "./loadConfig2";
import { loadGeneralReward } from "./loadGeneralReward";
import { loadGhost } from "./loadGhost";
import { loadProfile } from "./loadProfile";
import { loadReward as loadRewardTable } from "./loadRewardTable";
import { loadServerList } from "./loadServerList";
import { loadStocker } from "./loadStocker";
import { loadTeamRanking } from "./loadTeamRanking";
import { loadTopTen } from "./loadTopTen";
import { lockGarage } from "./lockGarage";
import { lockProfile } from "./lockProfile";
import { msg00AD } from "./msg00AD";
import { saveExpedition } from "./saveExpedition";
import { saveGarage } from "./saveGarage";
import { saveProfile } from "./saveProfile";
import { saveSettings } from "./saveSettings";
import { saveStocker } from "./saveStocker";
import { saveTimeAttack } from "./saveTimeAttack";
import { saveTopic } from "./saveTopic";
import { unlockProfile } from "./unlockProfile";
import { updateProvisionalStoreRank } from "./updateProvisionalStoreRank";
import { updateResult } from "./updateResult";
import { updateStoryClearNum } from "./updateStoryClearNum";
import { updateTeamPoints } from "./updateTeamPoints";
import { updateUiReport } from "./updateUiReport";
import { updateUserLog } from "./updateUserLog";
import { Request } from "../request";
import { Response } from "../response";
import { World } from "../world";

export async function dispatch(w: World, req: Request): Promise<Response> {
  switch (req.type) {
    case "check_team_name_req":
      return checkTeamName(w, req);

    case "create_profile_req":
      return createProfile(w, req);

    case "create_team_req":
      return createTeam(w, req);

    case "join_auto_team_req":
      return _team(w, req);

    case "load_2on2_req":
      return load2on2(w, req);

    case "load_config_req":
      return loadConfig(w, req);

    case "load_config_v2_req":
      return loadConfig2(w, req);

    case "discover_profile_req":
      return discoverProfile(w, req);

    case "load_general_reward_req":
      return loadGeneralReward(w, req);

    case "load_ghost_req":
      return loadGhost(w, req);

    case "load_profile_req":
      return loadProfile(w, req);

    case "load_reward_table_req":
      return loadRewardTable(w, req);

    case "load_server_list_req":
      return loadServerList(w, req);

    case "load_stocker_req":
      return loadStocker(w, req);

    case "load_team_req":
      return _team(w, req);

    case "load_top_ten_req":
      return loadTopTen(w, req);

    case "lock_garage_request":
      return lockGarage(w, req);

    case "lock_profile_req":
      return lockProfile(w, req);

    case "load_team_ranking_req":
      return loadTeamRanking(w, req);

    case "msg_00AD_req":
      return msg00AD(w, req);

    case "save_expedition_req":
      return saveExpedition(w, req);

    case "save_garage_req":
      return saveGarage(w, req);

    case "save_profile_req":
      return saveProfile(w, req);

    case "save_settings_req":
      return saveSettings(w, req);

    case "save_topic_req":
      return saveTopic(w, req);

    case "save_stocker_req":
      return saveStocker(w, req);

    case "save_time_attack_req":
      return saveTimeAttack(w, req);

    case "unlock_profile_req":
      return unlockProfile(w, req);

    case "update_provisional_store_rank_req":
      return updateProvisionalStoreRank(w, req);

    case "update_result_req":
      return updateResult(req);

    case "update_story_clear_num_req":
      return updateStoryClearNum(w, req);

    case "update_team_points_req":
      return updateTeamPoints(w, req);

    case "update_ui_report_req":
      return updateUiReport(w, req);

    case "update_user_log_req":
      return updateUserLog(w, req);

    default:
      const exhaustCheck: never = req;

      throw new Error(`Unhandled message ${req["type"]}`);
  }
}
