export function cloneTemplateRow(
  templateId: string,
  fields: Readonly<Record<string, string>>,
): DocumentFragment {
  const template = document.getElementById(templateId);

  if (!(template instanceof HTMLTemplateElement)) {
    throw new Error(`Missing template #${templateId}`);
  }

  const row = template.content.cloneNode(true) as DocumentFragment;

  for (const [field, text] of Object.entries(fields)) {
    const element = row.querySelector(`[data-field="${field}"]`);

    if (element) {
      element.textContent = text;
    }
  }

  return row;
}
