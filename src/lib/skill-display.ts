export function skillStatChips(skill: { cost?: string; power?: string; cooldown?: string; breakValue?: string }) {
  return [
    { label: "EP", value: skill.cost || "0" },
    { label: "Might", value: skill.power || "0" },
    ...(skill.cooldown ? [{ label: "CD", value: skill.cooldown }] : []),
    ...(skill.breakValue ? [{ label: "Break", value: skill.breakValue }] : []),
  ];
}
