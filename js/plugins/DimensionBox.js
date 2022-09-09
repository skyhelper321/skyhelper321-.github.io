//=============================================================================
// DimensionBox.js
//=============================================================================

/*:ja
 * @plugindesc ver1.00　ﾎﾞｯｸｽ!
 * @author まっつＵＰ
 * 
 * @param amount
 * @desc 0以外の時はargs[2]を直接数量として参照させます。
 * @default 0
 *
 * @help
 * 
 * RPGで笑顔を・・・
 * 
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 * 
 * プラグインコマンドで機能を呼び出します。
 * commandはアイテム等の増減どちらでも使えます。
 * 
 * command:Dimension
 * args:
 * 0:I・・・アイテム W・・・武器 A・・・防具
 * 1:変数のID(値をアイテム等のIDとして参照します。)
 * 2:変数のID(値を数量として参照します。)
 * args[2]はパラメータamountによって直接数量として参照させることができます。
 * 
 * 使用例（半角スペースに注意してください。）
 * ID10の変数のIDのアイテムをID11の変数の値分だけ増加させます。
 * Dimension I 10 11
 * 
 * このプラグインを利用する場合は
 * readmeなどに「まっつＵＰ」の名を入れてください。
 * また、素材のみの販売はダメです。
 * 上記以外の規約等はございません。
 * もちろんツクールMVで使用する前提です。
 * 何か不具合ありましたら気軽にどうぞ。
 *  
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 * 
 */

(function() {
    
    var parameters = PluginManager.parameters('DimensionBox');
    var DBamount = Number(parameters['amount'] || 0);

    var _Game_Interpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'Dimension') {

             var val1 = $gameVariables.value(args[1]);

            switch(args[0]){
             
             case 'I':
             var val2 = $dataItems[val1]; 
             break;

             case 'W':
             var val2 = $dataWeapons[val1];
             break;

             case 'A':
             var val2 = $dataArmors[val1];
             break;

             default:
             console.log('引数が入ってないやん！')
             return; //エラー回避
              
            }
            
             if(DBamount == 0){
                 var val3 = $gameVariables.value(args[2]);
             }else{
                 var val3 = Number(args[2] || 1);
             }
             
             $gameParty.boxgain(val2,val3);

        }
    };
    
    Game_Party.prototype.boxgain = function(val2,val3) { //新規
     if(!val2) console.log('変数に値が入ってないやん！');
     $gameParty.gainItem(val2, val3, false);
    };
        
})();
