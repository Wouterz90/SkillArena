"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
require('abilities/base_ability');
var stab = /** @class */ (function (_super) {
    __extends(stab, _super);
    function stab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    stab.prototype.CastFilterResult = function () {
        if (this.GetCaster().IsDisarmed()) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
        return UnitFilterResult.UF_SUCCESS;
    };
    stab.prototype.GetCustomCastError = function () {
        if (this.GetCaster().IsRooted()) {
            return "#Can't attack while rooted.";
        }
    };
    stab.prototype.GetPlaybackRateOverride = function () {
        return 2;
    };
    stab.prototype.GetCastRange = function () {
        return 5000;
    };
    stab.prototype.OnSpellStart = function () {
        var caster = this.GetCaster();
        var caster_origin = caster.GetAbsOrigin();
        var caster_forward = caster.GetForwardVector();
        var range = this.GetProjectileRange();
        caster.EmitSound("Hero_PhantomAssassin.Attack");
        var units = FindUnitsInRadius(caster.GetTeamNumber(), caster_origin, null, range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindType_t.FIND_CLOSEST, false);
        for (var _i = 0, units_1 = units; _i < units_1.length; _i++) {
            var unit = units_1[_i];
            var unit_origin = unit.GetAbsOrigin();
            if (caster_forward.Dot((unit_origin - caster_origin).Normalized()) > 0.5 || (unit.GetRangeToUnit(caster) < 100 && caster_forward.Dot((unit_origin - caster_origin).Normalized()) > 0)) {
                var damageTable = {
                    damage: this.GetSpecialValueFor("damage"),
                    victim: unit,
                    attacker: caster,
                    ability: this,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
                };
                ApplyDamage(damageTable);
                caster.EmitSound("Hero_PhantomAssassin.CoupDeGrace");
                var particle = ParticleManager.CreateParticle("particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
                ParticleManager.SetParticleControlEnt(particle, 0, unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", unit_origin, true);
                ParticleManager.SetParticleControlEnt(particle, 1, unit, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_origin", unit_origin, true);
                ParticleManager.ReleaseParticleIndex(particle);
                return;
            }
        }
        var OVERHEAD_ALERT_MISS = 5;
        SendOverheadEventMessage(null, OVERHEAD_ALERT_MISS, caster, 1, null);
        caster.EmitSound("Hero_KeeperOfTheLight.Recall.Fail");
    };
    return stab;
}(base_ability));
var shoot = /** @class */ (function (_super) {
    __extends(shoot, _super);
    function shoot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    shoot.prototype.CastFilterResult = function () {
        if (this.GetCaster().IsDisarmed()) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
        return UnitFilterResult.UF_SUCCESS;
    };
    shoot.prototype.GetCustomCastError = function () {
        if (this.GetCaster().IsRooted()) {
            return "#Can't attack while rooted.";
        }
    };
    shoot.prototype.GetPlaybackRateOverride = function () {
        return 2;
    };
    shoot.prototype.GetCastRange = function () {
        return this.GetCaster().GetAttackRange();
    };
    shoot.prototype.GetSound = function () {
        return "Hero_Windrunner.Attack";
    };
    shoot.prototype.GetProjectileRange = function () {
        return this.GetCaster().GetAttackRange();
    };
    shoot.prototype.GetProjectileParticleName = function () {
        return this.GetCaster().GetRangedProjectileName();
    };
    shoot.prototype.GetProjectileUnitBehavior = function () { return ProjectileInteractionType.PROJECTILES_DESTROY; };
    shoot.prototype.GetProjectileProjectileBehavior = function () { return ProjectileInteractionType.PROJECTILES_NOTHING; };
    shoot.prototype.GetProjectileWallBehavior = function () { return ProjectileInteractionType.PROJECTILES_BOUNCE; };
    shoot.prototype.GetProjectileItemBehavior = function () { return ProjectileInteractionType.PROJECTILES_NOTHING; };
    shoot.prototype.OnProjectileHitUnit = function (projectile, unit, caster) {
        var damageTable = {
            damage: this.GetSpecialValueFor("damage") * 1 - ((this.GetCaster().GetAttackRange() - 150) / 600),
            victim: unit,
            attacker: this.GetCaster(),
            ability: this,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
        };
    };
    return shoot;
}(base_ability));