/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'PortsClientShell.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const target = '<div className="px-4 mt-3">';
const replacement = `
            {/* Just Landed CTA */}
            <div className="px-4 mt-8 mb-4">
                <Link href="/just-landed" className="block bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-5 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all text-white relative overflow-hidden group">
                    <div className="absolute -right-2 -top-2 text-7xl opacity-20 group-hover:scale-110 transition-transform blur-sm">🌴</div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
                            <span className="material-symbols-outlined text-white text-3xl">flight_land</span>
                        </div>
                        <div>
                            <h3 className="font-black text-sm text-white mb-0.5 shadow-sm">Just arrived at the port?</h3>
                            <p className="text-[10px] text-indigo-100 uppercase tracking-widest font-bold">Tap here for a quick guide</p>
                        </div>
                        <span className="material-symbols-outlined absolute right-2 text-white/50 group-hover:translate-x-1 group-hover:text-white transition-all">arrow_forward</span>
                    </div>
                </Link>
            </div>

            <div className="px-4 mt-3">`;

content = content.replace(target, replacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated component.');
