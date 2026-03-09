import fs from 'fs/promises';
import path from 'path';

const COMPONENTS_DIR = path.resolve('./next-app/src/components');
const APP_DIR = path.resolve('./next-app/src/app');

async function main() {
    try {
        const files = await fs.readdir(COMPONENTS_DIR);

        let links = [];

        for (const file of files) {
            if (!file.endsWith('.tsx')) continue;

            const componentName = file.replace('.tsx', '');
            const routePath = componentName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

            const pageDir = path.join(APP_DIR, routePath);
            await fs.mkdir(pageDir, { recursive: true });

            const pageContent = `import ${componentName} from '@/components/${componentName}';

export default function Page() {
  return <${componentName} />;
}
`;
            await fs.writeFile(path.join(pageDir, 'page.tsx'), pageContent);
            console.log(`Created route /${routePath} for ${componentName}`);

            links.push(`        <a href="/${routePath}" className="block p-4 border rounded-xl hover:border-primary hover:shadow-lg transition-all bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-medium">${componentName}</a>`);
        }

        // Create an elegant index page
        const indexContent = `export default function Home() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8 font-display">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Stitch UI Components</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Converted 30 exported designs into functional Next.js components</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
${links.join('\n')}
        </div>
      </div>
    </div>
  );
}
`;

        await fs.writeFile(path.join(APP_DIR, 'page.tsx'), indexContent);
        console.log('Successfully generated index page and all routes.');

    } catch (err) {
        console.error('Error generating pages:', err);
    }
}

main();
