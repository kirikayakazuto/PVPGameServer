"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MysqlCenter_1 = require("../database/MysqlCenter");
const GameServerConfig_1 = require("../GameServerConfig");
const utils_1 = require("../util/utils");
const RES_1 = require("../RES");
/**
 * 每日登录奖励
 * 时间: 2019年4月6日19:16:47
 * 作者: 邓朗
 */
class loginBonues {
    /**
     * 检查玩家是否需不需要领取每日奖励
     * @param player
     */
    static async checkHasLoginBonues(player) {
        let arr = await MysqlCenter_1.default.getLoginBonuesInfo(player.openId);
        if (!arr || arr.length <= 0) { // 数据库没有这个用户, 创建一个
            await MysqlCenter_1.default.insertUserLoginBonues(player.openId, GameServerConfig_1.default.loginBonues.bonues[0]);
            return { code: RES_1.default.OK, msg: null };
        }
        let loginBonuesInfo = arr[0];
        if (!loginBonuesInfo)
            return { code: RES_1.default.ERR_SYSTEM, msg: "don have loginUserInfo" };
        let hasBonues = loginBonuesInfo.bonues_time < utils_1.default.timestamp_today();
        if (!hasBonues)
            return { code: RES_1.default.OK, msg: "时间戳不对" };
        let days = 1;
        let isStraight = loginBonuesInfo.bonues_time >= utils_1.default.timestamp_yesterday();
        if (isStraight)
            days = loginBonuesInfo.days + 1;
        let index = days - 1; // 奖励索引
        if (days > GameServerConfig_1.default.loginBonues.bonues.length) {
            if (GameServerConfig_1.default.loginBonues.clearLoginStraight) {
                days = 1;
                index = 0;
            }
            else {
                index = GameServerConfig_1.default.loginBonues.bonues.length - 1;
            }
        }
        await MysqlCenter_1.default.updateUserLoginBonuesInfo(player.openId, GameServerConfig_1.default.loginBonues.bonues[index], days);
        return { code: RES_1.default.OK, msg: {} };
    }
    static getLoginBonuesData() {
    }
    static async getLoginBonuesInfo(player) {
        let arr = await MysqlCenter_1.default.getLoginBonuesInfo(player.openId);
        if (!arr || arr.length <= 0)
            return { code: RES_1.default.ERR_SYSTEM, msg: "没有获取到签到信息!" };
        let bonuesInfo = arr[0];
        if (bonuesInfo.status != 0)
            return { code: RES_1.default.GET_LOGIN_BONUES_AGO, msg: {
                    isSign: true,
                    bonues: 0,
                    days: bonuesInfo.days,
                    allBonues: GameServerConfig_1.default.loginBonues.bonues
                } };
        return { code: RES_1.default.OK, msg: {
                isSign: false,
                bonues: bonuesInfo.bonues,
                days: bonuesInfo.days,
                allBonues: GameServerConfig_1.default.loginBonues.bonues
            } };
    }
    static async getLoginBonuesResult(player) {
        let arr = await MysqlCenter_1.default.getLoginBonuesInfo(player.openId);
        if (!arr || arr.length <= 0)
            return { code: RES_1.default.ERR_SYSTEM, msg: "" };
        let bonuesInfo = arr[0];
        if (bonuesInfo.status != 0)
            return { code: RES_1.default.ERR_SYSTEM, msg: null };
        await MysqlCenter_1.default.updateUserLoginBonuesRecved(player.openId);
        // 更新玩家数据
        await MysqlCenter_1.default.updataUserChipByOpenId(player.openId, bonuesInfo.bonues);
        return { code: RES_1.default.OK, msg: {
                bonues: bonuesInfo.bonues,
            } };
    }
}
exports.default = loginBonues;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW5Cb251ZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9hcHAvZG9tYWluL2xvZ2luQm9udWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseURBQWtEO0FBRWxELDBEQUFrRDtBQUNsRCx5Q0FBa0M7QUFDbEMsZ0NBQXlCO0FBRXpCOzs7O0dBSUc7QUFDSDtJQUVJOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsTUFBa0I7UUFDdEQsSUFBSSxHQUFHLEdBQVEsTUFBTSxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVuRSxJQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFLEVBQUcsa0JBQWtCO1lBQzdDLE1BQU0scUJBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLDBCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvRixPQUFPLEVBQUMsSUFBSSxFQUFFLGFBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxDQUFDO1NBQ3BDO1FBQ0QsSUFBSSxlQUFlLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUcsQ0FBQyxlQUFlO1lBQUUsT0FBTyxFQUFDLElBQUksRUFBRSxhQUFHLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSx3QkFBd0IsRUFBQyxDQUFDO1FBRWxGLElBQUksU0FBUyxHQUFHLGVBQWUsQ0FBQyxXQUFXLEdBQUcsZUFBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3RFLElBQUcsQ0FBQyxTQUFTO1lBQUUsT0FBTyxFQUFDLElBQUksRUFBRSxhQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUMsQ0FBQztRQUNuRCxJQUFJLElBQUksR0FBRyxDQUFDLENB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