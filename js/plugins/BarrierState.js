//=============================================================================
// BarrierState.js
//
// ----------------------------------------------------------------------------
// by ecf5DTTzl6h6lJj02
// 2019/08/21
//=============================================================================

/*:
 * @plugindesc ステート拡張用プラグインです。詳しくはヘルプをどうぞ。
 * @author ecf5DTTzl6h6lJj02
 *
 *
 * @help
 * ステート拡張用のプラグインです。
 * 
 * プラグインコマンドはありません。
 * 
 * ■設定できる項目と設定方法
 * 
 * ・攻撃がヒットしていればダメージが無くても解除されるステート:
 * <removeNoDamage>もしくは<無傷解除>と記述してください。
 * ダメージで解除の設定がされていることが条件に含まれるので、
 * 忘れないよう注意してください。
 * 
 * ・一定のダメージをカットするステート：
 * <CutDamage: x>もしくは<カットダメージ: x>と記述してください。
 * ステートが有効の間、属性有効度や、分散度、クリティカルを適用したダメージ値から
 * x で指定した値を減算します。
 * このステートを複数作成して、重ねがけで効果の合算をすることはできません。
 * x の値の最も大きいもののみ有効になります。
 * (同じ値の場合は、古いものが有効)
 */
 
(function(){
	//ノーダメージ解除ステート---------------------------------------------------
	//ダメージの処理(再定義)
	executeDamage_O = Game_Action.prototype.executeDamage;
	Game_Action.prototype.executeDamage = function(target, value) {
		executeDamage_O.call(this, target, value);
    target.removeStatesByNoDamage();
	};

	//ノーダメージでも<removeNoDamage>もしくは<無傷解除>
	//が記載されていればステートを解除する関数
	Game_Battler.prototype.removeStatesByNoDamage = function() {
    this.states().forEach(function(state) {
        if ((state.meta.removeNoDamage || state.meta['無傷解除'] || false) && 
        		state.removeByDamage && 	Math.randomInt(100) < state.chanceByDamage) {
            this.removeState(state.id);
        }
    }, this);
	};
	//---------------------------------------------------------------------------
	
	//ダメージ計算
	Game_Action.prototype.makeDamageValue = function(target, critical) {
	    var item = this.item();
	    var baseValue = this.evalDamageFormula(target);
	    var value = baseValue * this.calcElementRate(target);
	    var cutDamage = target.checkCutDamage();
	    if (this.isPhysical()) {
	        value *= target.pdr;
	    }
	    if (this.isMagical()) {
	        value *= target.mdr;
	    }
	    if (baseValue < 0) {
	        value *= target.rec;
	        cutDamage = 0;
	    }
	    if (critical) {
	        value = this.applyCritical(value);
	    }
	    value = this.applyVariance(value, item.damage.variance);
	    value = this.applyGuard(value, target);
	    value = Math.round(value);
	    if (0 < value){
					value = Math.max(value - cutDamage, 0);
			}
	    return value;
	};
	
	Game_Battler.prototype.checkCutDamage = function(){
		var cutDamages = [];
		this.states().forEach(function(state){
			cutDamages.push( Number(state.meta.CutDamage) || Number(state.meta['カットダメージ']) || 0)
		}, this);
		cutDamages.sort();
		return 0 < cutDamages.length ? cutDamages[cutDamages.length - 1] : 0;
	};
	
	Game_Battler.prototype.isStateAddable = function(stateId) {
    return (this.isAlive() && $dataStates[stateId] &&
            !this.isStateResist(stateId) &&
            !this._result.isStateRemoved(stateId) &&
            !this.isStateRestrict(stateId) &&
            !this.isConpetingStates(stateId));
	};

	Game_Battler.prototype.isConpetingStates = function(stateId){
		var affectedCutDamage = 0, newCutDamage = 0, flag = false;
		newCutDamage = (Number($dataStates[stateId].meta.CutDamage) || 
										Number($dataStates[stateId].meta['カットダメージ']) ||
										 0);
		if(newCutDamage <= 0) return false;
		this.states().forEach(function(state){
			affectedCutDamage = (Number(state.meta.CutDamage) || 
														Number(state.meta['カットダメージ']) ||
														 0);
			if(newCutDamage <= affectedCutDamage){
				flag = true;
			}
			else if(affectedCutDamage != 0){
					this.removeState(state.id);
			}
		}, this);
		return flag;
	};

})();
