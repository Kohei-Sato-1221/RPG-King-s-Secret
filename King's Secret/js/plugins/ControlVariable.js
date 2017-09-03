//=============================================================================
// ControlVariable(Beta).js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 fftfantt
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 0.1.0 2015/12/20 β版
// ----------------------------------------------------------------------------
// [Blog]   :
// [Twitter]: https://twitter.com/fftfantt/
// [GitHub] : 
//=============================================================================

/*:
 * @plugindesc 変数の操作
 * @author fftfantt
 * 
 * @help プラグインコマンド[変数の操作]により指定の変数の値を操作
 * 
 * 詳細：
 *  指定の変数の値を操作(代入、加算、減算、乗算、除算、剰余)します。
 *  変数の指定について、イベントエディタのコマンドと同じ#0001なども使用できます。
 *  プラグインコマンドで[変数の操作]もしくは[ControlVariabl]か[ConVar]を記述して使用します。
 * 
 *  ## CountQuiz
 * 
 * パラメータ：
 *  引数1：操作する変数
 *  引数2：操作する内容 [代入：=  加算:+=  減算：-=  乗算：*=  除算：/=  剰余：%=]  
 *						or
 *                      [代入：set  加算:add  減算：sub  乗算：mult  除算：div  剰余：mod]
 *  引数3：操作用の値
 * 
 *制御文字：
 * 各パラメーターには以下の制御文字が使用できます。
 *   \V[n] 変数n番目の値
 *   \N[n] アクターn番目の名前
 *   \P[n] パーティメンバーn番目
 *   \G    通貨単位
 * 
 * 使用例：
 *   変数の操作 #0001 += \V[2]	//変数1に変数2の値を加算
 *   変数の操作 \V[2] = \V[3]	//変数2の値と同番号の変数に変数3の値を代入
 *   変数の操作 1 mod \V[2]	//変数1を変数2の値で除算した余りを代入
 *   ControlVariable 1 += 2	//変数1に2を加算
 *   ConVar 1 mult \V[5]		//変数1を変数5の値で乗算
 * 
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  ただし、ヘッダのライセンス表示は残してください。
 */

(function() {    
    var UseCtlChr = function(text) {
    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\');
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
        return this.actorName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
        return this.partyMemberName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    return text;
};

        var parameters = PluginManager.parameters('変数の操作');
        var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
          
	    Game_Interpreter.prototype.pluginCommand = function(command, args) {
          _Game_Interpreter_pluginCommand.call(this, command, args);
          command=command.replace( 'ControlVariable' , '変数の操作' ) ;
          command=command.replace( 'ConVar' , '変数の操作' ) ;
 
          
          if (command === '変数の操作') {
             for (var i=0; i<args.length; i++) {
                args[i] = UseCtlChr (args[i]);
          // sato added
          }

          args[0]=args[0].replace( '#' , '' ) ;
                       
          var VarId1   = parseInt(args[0],10);
          var Var1 = args[2];
          var Var2 = $gameVariables.value(VarId1);

          if (!isFinite(VarId1)) return;
          
          args[1]=args[1].replace( 'set' , '=' ) ;
          args[1]=args[1].replace( 'add' , '+=' ) ;
          args[1]=args[1].replace( 'sub' , '-=' ) ;
          args[1]=args[1].replace( 'mult' , '*=' ) ;
          args[1]=args[1].replace( 'div' , '/=' ) ;
          args[1]=args[1].replace( 'mod' , '%=' ) ;
                            
          if (args[1]=='=') {
              $gameVariables.setValue(VarId1,parseInt(Var1,10));
          }

          if (!isFinite(Var1)) return;
          if (!isFinite(Var2)) return;
          
          Var1 = parseInt(Var1,10);
          Var2 = parseInt(Var2,10);
  
          if (args[1]=='+=') {
              $gameVariables.setValue(VarId1,Var2+Var1);
          }
          if (args[1]=='-=') {
              $gameVariables.setValue(VarId1,Var2-Var1);
          }
          if (args[1]=='*=') {
              $gameVariables.setValue(VarId1,Var2*Var1);
          }
          if (args[1]=='/=') {
              $gameVariables.setValue(VarId1,(Var2-(Var2%Var1))/Var1);
          }
          if (args[1]=='%=') {
              $gameVariables.setValue(VarId1,Var2%Var1);
          }
        }
       }    
    })();


