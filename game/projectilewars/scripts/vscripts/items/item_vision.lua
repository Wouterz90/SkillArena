require("items/base_item")
item_rune_vision = class(item_base_rune)
function item_rune_vision.new(construct, ...)
    local instance = setmetatable({}, item_rune_vision)
    if construct and item_rune_vision.constructor then item_rune_vision.constructor(instance, ...) end
    return instance
end
LinkLuaModifier("modifier_rune_vision","items/item_vision.lua",LUA_MODIFIER_MOTION_NONE)
modifier_rune_vision = {}
function modifier_rune_vision.new(construct, ...)
    local instance = setmetatable({}, modifier_rune_vision)
    if construct and modifier_rune_vision.constructor then modifier_rune_vision.constructor(instance, ...) end
    return instance
end
function modifier_rune_vision.DeclareFunctions(self)
    return {MODIFIER_PROPERTY_BONUS_DAY_VISION,MODIFIER_PROPERTY_BONUS_NIGHT_VISION}
end
function modifier_rune_vision.OnCreated(self)
    self.vision=self.GetAbility(self).GetSpecialValueFor(self.GetAbility(self),"bonus_vision")
end
function modifier_rune_vision.GetBonusDayVision(self)
    return self.vision
end
function modifier_rune_vision.GetBonusNightVision(self)
    return self.vision
end