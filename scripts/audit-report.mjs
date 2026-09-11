import { createServer } from 'vite';
import { writeFile } from 'node:fs/promises';
import { format, resolveConfig } from 'prettier';
const server = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
});
try {
  const { createReport } = await server.ssrLoadModule('/src/lib/report.ts');
  const { reportTestCases } = await server.ssrLoadModule('/src/data/reportTestCases.ts');
  const rows = reportTestCases.map((t) => {
    const r = createReport(t.parent, t.child, '2026-09-11');
    return {
      name: t.name,
      age: r.age,
      archetype: r.archetype.id,
      title: r.archetype.copy.title,
      triggerIds: r.triggers.map((t) => t.id),
      triggerTitles: r.triggers.map((t) => t.copy.title),
      scenario: r.translator.id,
      scene: r.translator.copy.scene,
      phrase: r.powerPhrase.copy.phrase,
    };
  });
  const count = (key) =>
    new Set(rows.map((r) => (Array.isArray(r[key]) ? r[key].join(',') : r[key]))).size;
  const report = {
    asOfDate: '2026-09-11',
    modelVersion: 'traits-v1',
    combinations: rows.length,
    uniqueArchetypes: count('archetype'),
    uniqueScenarios: count('scenario'),
    uniqueTriggerSets: count('triggerIds'),
    results: rows,
  };
  const outputPath = 'docs/content-audit.json';
  await writeFile(
    outputPath,
    await format(JSON.stringify(report), {
      ...(await resolveConfig(outputPath)),
      filepath: outputPath,
    }),
  );
  console.log(JSON.stringify({ ...report, results: undefined }, null, 2));
} finally {
  await server.close();
}
