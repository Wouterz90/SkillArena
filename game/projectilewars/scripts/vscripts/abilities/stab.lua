--=======================================================================================
-- Generated by TypescriptToLua transpiler https://github.com/Perryvw/TypescriptToLua 
-- Date: Wed Mar 14 2018
--=======================================================================================
require("typescript_lualib")
require("abilities/base_ability")
stab = base_ability.new()
stab.__index = stab
stab.__base = base_ability
function stab.new(construct, ...)
    local instance = setmetatable({}, stab)
    if construct and stab.constructor then stab.constructor(instance, ...) end
    return instance
end
function stab.GetCastAnimation(self)
    if (self:GetCaster():GetUnitName()=="npc_dota_hero_tiny") and (self:GetCaster():GetModifierStackCount("modifier_tree_toss_check",self:GetCaster())==1) then
        return ACT_TINY_TOSS
    else
        return ACT_DOTA_ATTACK
    end
end
function stab.CastFilterResult(self)
    if self:GetCaster():IsDisarmed() then
        return UF_FAIL_CUSTOM
    end
    return UF_SUCCESS
end
function stab.GetCustomCastError(self)
    if self:GetCaster():IsRooted() then
        return "#Can't attack while rooted."
    end
end
function stab.GetCastPoint(self)
    if self:GetCaster():GetModifierStackCount("modifier_tree_toss_check",self:GetCaster())==1 then
        return self:GetSpecialValueFor("cast_point")*1.5
    else
        return self:GetSpecialValueFor("cast_point")
    end
end
function stab.GetPlaybackRateOverride(self)
    return 2
end
function stab.GetCastRange(self)
    return 5000
end
function stab.OnSpellStart(self)
    local caster = self:GetCaster()

    local caster_origin = caster:GetAbsOrigin()

    local caster_forward = caster:GetForwardVector()

    local range = self:GetProjectileRange()

    local min_range = 100

    if caster:GetModifierStackCount("modifier_tree_toss_check",caster)==1 then
        range=(range*1.5)
        min_range=(min_range*1.5)
    end
    caster:EmitSound("Hero_PhantomAssassin.Attack")
    local units = FindUnitsInRadius(caster:GetTeamNumber(),caster_origin,nil,range,DOTA_UNIT_TARGET_TEAM_ENEMY,DOTA_UNIT_TARGET_HERO+DOTA_UNIT_TARGET_BASIC,DOTA_UNIT_TARGET_FLAG_NONE,FIND_CLOSEST,false)

    for _, unit in ipairs(units) do
        local unit_origin = unit:GetAbsOrigin()

        local m = unit_origin-caster_origin

        if (caster_forward:Dot(m:Normalized())>0.5) or ((unit:GetRangeToUnit(caster)<min_range) and (caster_forward:Dot(m:Normalized())>0)) then
            local damageTable = {damage=self:GetSpecialValueFor("damage"),victim=unit,attacker=caster,ability=self,damage_type=DAMAGE_TYPE_PHYSICAL}

            ApplyDamage(damageTable)
            caster:EmitSound("Hero_PhantomAssassin.CoupDeGrace")
            local particle = ParticleManager:CreateParticle("particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf",PATTACH_CUSTOMORIGIN,caster)

            ParticleManager:SetParticleControlEnt(particle,0,unit,PATTACH_POINT_FOLLOW,"attach_hitloc",unit_origin,true)
            ParticleManager:SetParticleControlEnt(particle,1,unit,PATTACH_ABSORIGIN_FOLLOW,"attach_origin",unit_origin,true)
            ParticleManager:ReleaseParticleIndex(particle)
            return nil
        end
    end
    SendOverheadEventMessage(nil,OVERHEAD_ALERT_MISS,caster,1,nil)
    caster:EmitSound("Hero_KeeperOfTheLight.Recall.Fail")
end
