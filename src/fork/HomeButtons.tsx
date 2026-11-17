// Fork addition: the vignette over the wallpaper, the LG Home style button column (top left) and the
// test page for finding app IDs (long-press OK on any button).

import {useEffect, useState} from 'preact/hooks';
import {useKeys} from '../hooks/useKeys';
import {appExists, launchApp} from '../lib/launch';
import {SYSTEM_BUTTONS, PROBE_TARGETS, describeTarget} from './systembuttons';
import './fork.css';

/** Darkens the screen edges (40% in the corners) so light icons stay readable on any wallpaper. */
export function Vignette () {
	return <div class="fork-vignette" aria-hidden="true" />;
}

const S = {fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'} as const;

/** An 8-tooth cog outline, centred in a 24x24 box. */
function gearPath (): string {
	let d = '';
	const n = 8;
	for (let i = 0; i < n * 2; i++) {
		const a0 = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2 - 0.19;
		const a1 = a0 + Math.PI / n;
		const r = i % 2 ? 7.4 : 9.6;
		const x0 = 12 + r * Math.cos(a0 + 0.08), y0 = 12 + r * Math.sin(a0 + 0.08);
		const x1 = 12 + r * Math.cos(a1 - 0.08), y1 = 12 + r * Math.sin(a1 - 0.08);
		d += `${i ? 'L' : 'M'}${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
	}
	return d + 'Z';
}
const GEAR = gearPath();

function Icon ({name}: {name: string}) {
	return (
		<svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
			{name === 'account' && [<circle key="h" cx="12" cy="8.5" r="3.6" {...S} />, <path key="b" d="M5 19.5c1.2-3.6 4-5.3 7-5.3s5.8 1.7 7 5.3" {...S} />]}
			{name === 'notifications' && [<path key="b" d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5z" {...S} />, <path key="c" d="M10.2 20a2 2 0 0 0 3.6 0" {...S} />]}
			{name === 'quicksettings' && [<path key="g" d={GEAR} {...S} />, <circle key="c" cx="12" cy="12" r="3" {...S} />]}
			{name === 'search' && [<circle key="c" cx="10.5" cy="10.5" r="6" {...S} />, <path key="h" d="M15 15l5 5" {...S} />]}
			{name === 'guide' && [<rect key="f" x="3.5" y="5" width="17" height="14" rx="1.2" {...S} />, <rect key="p" x="6" y="7.6" width="5" height="3.4" {...S} />, <path key="l" d="M6 13.6h12M6 16.2h12M13.5 8.4h4.5" {...S} />]}
		</svg>
	);
}

interface ButtonsProps {
	focused: number;
	hidden: boolean;
	onHover: (index: number) => void;
	onPick: (index: number) => void;
}

/** The button column; focus and keys are handled by Home (see buttonKey in systembuttons.ts). */
export function HomeButtons ({focused, hidden, onHover, onPick}: ButtonsProps) {
	return (
		<div class={`fork-buttons${hidden ? ' fork-buttons--hidden' : ''}`}>
			{SYSTEM_BUTTONS.map((b, i) => (
				<div
					key={b.key}
					class={`fork-button${i === focused ? ' fork-button--focused' : ''}`}
					style={{top: `${BUTTON_Y[i] - 30}px`}}
					title={b.label}
					onMouseEnter={() => onHover(i)}
					onClick={() => onPick(i)}
				>
					<Icon name={b.key} />
				</div>
			))}
		</div>
	);
}

/** Centres measured from LG Home on an LG C3 (1920x1080). */
const BUTTON_Y = [70, 159, 245, 331, 417];

type Status = 'checking' | 'found' | 'missing';

/** The test page: every candidate app ID, whether the TV has it, and OK to launch it. */
export function ProbePanel ({onClose}: {onClose: () => void}) {
	const [status, setStatus] = useState<Status[]>(() => PROBE_TARGETS.map(() => 'checking'));
	const [result, setResult] = useState<string[]>(() => PROBE_TARGETS.map(() => ''));
	const [at, setAt] = useState(0);

	useEffect(() => {
		PROBE_TARGETS.forEach((p, i) => {
			appExists(p.target.id).then((found) => setStatus((s) => s.map((v, j) => (j === i ? (found ? 'found' : 'missing') : v))));
		});
	}, []);

	useEffect(() => {
		const row = document.querySelector('.fork-probe__row--at');
		if (row && (row as HTMLElement).scrollIntoView) (row as HTMLElement).scrollIntoView({block: 'nearest'});
	}, [at]);

	const launch = (i: number) => {
		const t = PROBE_TARGETS[i].target;
		setResult((r) => r.map((v, j) => (j === i ? 'launching…' : v)));
		launchApp(t.id, t.params || {}).then(
			() => setResult((r) => r.map((v, j) => (j === i ? 'launched' : v))),
			(e) => setResult((r) => r.map((v, j) => (j === i ? 'error: ' + (e && e.message ? e.message : String(e)) : v)))
		);
	};

	useKeys((key) => {
		if (key === 'up') setAt((a) => Math.max(0, a - 1));
		else if (key === 'down') setAt((a) => Math.min(PROBE_TARGETS.length - 1, a + 1));
		else if (key === 'enter') launch(at);
		else if (key === 'back') onClose();
		return true;
	}, true);

	return (
		<div class="fork-probe">
			<div class="fork-probe__title">App ID test</div>
			<div class="fork-probe__hint">↑ ↓ choose · OK launches · Back closes. Try OK even on "not found" lines (the TV may refuse the check). Note which line opens the right screen.</div>
			<div class="fork-probe__list">
				{PROBE_TARGETS.map((p, i) => (
					<div key={i} class={`fork-probe__row${i === at ? ' fork-probe__row--at' : ''}`} onMouseEnter={() => setAt(i)} onClick={() => launch(i)}>
						<span class="fork-probe__group">{p.group}</span>
						<span class="fork-probe__id">{describeTarget(p.target)}</span>
						<span class={`fork-probe__status fork-probe__status--${status[i]}`}>{status[i] === 'missing' ? 'not found?' : status[i]}</span>
						<span class="fork-probe__result">{result[i]}</span>
					</div>
				))}
			</div>
		</div>
	);
}
