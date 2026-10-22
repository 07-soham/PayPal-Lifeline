export const categories=['Utilities','Groceries','Medical','Transportation','Housing','Other'];
export function ruleStructure(text) {
 const lower=text.toLowerCase();
 const category=lower.match(/electric|power|utility|water|gas bill/)?'Utilities':lower.match(/grocer|food|meal/)?'Groceries':lower.match(/medical|medicine|pharmacy|doctor|prescription/)?'Medical':lower.match(/bus|transport|fuel|ride/)?'Transportation':lower.match(/rent|housing|shelter/)?'Housing':'Other';
 const amountMatch=text.match(/(?:\$|USD\s*)(\d+(?:\.\d{1,2})?)/i);
 const sentence=text.trim().split(/(?<=[.!?])\s+/)[0]?.slice(0,240)||'';
 const missing=[]; if(!amountMatch)missing.push('Add the amount you need.'); if(text.trim().length<25)missing.push('Add a little more detail about why this is urgent.');
 return {category,amount:amountMatch?Number(amountMatch[1]):null,currency:'USD',summary:sentence,missing,urgency:/today|tomorrow|shut.?off|emergency|urgent|due now/i.test(text)?'urgent':'soon',nextStep:'Review the summary and confirm the amount before publishing.',source:'rules'};
}
