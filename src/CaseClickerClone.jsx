import { useState, useEffect, useRef } from 'react';

const rarities = [
  { name: 'Common',    chance: 50, color: 'bg-gray-400',   textColor: 'text-gray-300',   minVal: 5,    maxVal: 20   },
  { name: 'Uncommon',  chance: 25, color: 'bg-green-500',  textColor: 'text-green-400',  minVal: 25,   maxVal: 75   },
  { name: 'Rare',      chance: 15, color: 'bg-blue-500',   textColor: 'text-blue-400',   minVal: 100,  maxVal: 300  },
  { name: 'Epic',      chance: 7,  color: 'bg-purple-500', textColor: 'text-purple-400', minVal: 400,  maxVal: 900  },
  { name: 'Legendary', chance: 3,  color: 'bg-yellow-400', textColor: 'text-yellow-300', minVal: 1000, maxVal: 3000 },
];

function getRarity() {
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (const rarity of rarities) {
    cumulative += rarity.chance;
    if (roll < cumulative) return rarity;
  }
  return rarities[0];
}

function generateItem(rarity) {
  const skins = {
    Common:    ['Wooden Case', 'Rusty Blade', 'Grey Camo', 'Basic Wrap', 'Dull Knife'],
    Uncommon:  ['Forest Sniper', 'Moss AK', 'Jungle Pistol', 'Green Fade', 'Swamp Thing'],
    Rare:      ['Ocean Burst', 'Ice Shatter', 'Blue Steel', 'Arctic Fox', 'Deep Sea'],
    Epic:      ['Neon Viper', 'Cosmic Ray', 'Void Crawler', 'Ultraviolet', 'Shadow Pulse'],
    Legendary: ['Dragon Fire', 'Solar Flare', 'Golden Age', 'Mythic Edge', 'Celestial'],
  };
  const names = skins[rarity.name];
  const name = names[Math.floor(Math.random() * names.length)];
  const value = Math.floor(
    Math.random() * (rarity.maxVal - rarity.minVal + 1) + rarity.minVal
  );
  return { id: Date.now() + Math.random(), name, value, rarity: rarity.name, color: rarity.color, textColor: rarity.textColor };
}

export default function CaseClickerClone() {
  const [balance, setBalance] = useState(500);
  const [inventory, setInventory] = useState([]);
  const [upgradeLevel, setUpgradeLevel] = useState(0);
  const [lastDrop, setLastDrop] = useState(null);
  const [opening, setOpening] = useState(false);
  const [shake, setShake] = useState(false);
  const [notification, setNotification] = useState(null);
  const passiveRef = useRef(upgradeLevel);
  passiveRef.current = upgradeLevel;

  const CASE_COST = 50;

  useEffect(() => {
    if (upgradeLevel === 0) return;
    const interval = setInterval(() => {
      setBalance(b => b + passiveRef.current * 2);
    }, 1000);
    return () => clearInterval(interval);
  }, [upgradeLevel]);

  const showNotification = (msg, color = 'bg-green-500') => {
    setNotification({ msg, color });
    setTimeout(() => setNotification(null), 2000);
  };

  const openCase = () => {
    if (balance < CASE_COST || opening) return;
    setBalance(b => b - CASE_COST);
    setOpening(true);
    setShake(true);
    setTimeout(() => setShake(false), 500);

    setTimeout(() => {
      const rarity = getRarity();
      const item = generateItem(rarity);
      setLastDrop(item);
      setInventory(inv => [item, ...inv]);
      setOpening(false);
      showNotification(`${item.rarity}: ${item.name} ($${item.value})`,
        item.rarity === 'Legendary' ? 'bg-yellow-500' :
        item.rarity === 'Epic'      ? 'bg-purple-600' :
        item.rarity === 'Rare'      ? 'bg-blue-600'   : 'bg-green-600'
      );
    }, 800);
  };

  const sellItem = (id, value) => {
    setBalance(b => b + value);
    setInventory(inv => inv.filter(i => i.id !== id));
  };

  const sellAll = () => {
    const total = inventory.reduce((sum, i) => sum + i.value, 0);
    setBalance(b => b + total);
    setInventory([]);
    if (total > 0) showNotification(`Sold all items for $${total}`);
  };

  const upgradeCost = 500 + upgradeLevel * 500;

  const buyUpgrade = () => {
    if (balance < upgradeCost) {
      showNotification('Not enough funds!', 'bg-red-500');
      return;
    }
    setBalance(b => b - upgradeCost);
    setUpgradeLevel(l => l + 1);
    showNotification(`Case Factory upgraded to Lv.${upgradeLevel + 1}!`, 'bg-blue-500');
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white font-sans p-4 md:p-8">
      {notification && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl font-bold shadow-2xl text-white text-sm transition-all ${notification.color}`}>
          {notification.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            🎰 Case<span className="text-yellow-400">Clicker</span>
          </h1>
          <div className="bg-zinc-800 rounded-2xl px-6 py-3 text-2xl font-bold text-yellow-400 shadow-lg">
            ${balance.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="md:col-span-2 space-y-6">
            <div className="bg-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-6">
              <h2 className="text-2xl font-bold self-start">Open a Case</h2>

              <div
                onClick={openCase}
                className={`cursor-pointer select-none transition-transform duration-150
                  ${shake ? 'animate-bounce' : 'hover:scale-105 active:scale-95'}
                  ${balance < CASE_COST ? 'opacity-40 cursor-not-allowed' : ''}
                `}
              >
                <div className="w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl text-7xl">
                  {opening ? '⚙️' : '📦'}
                </div>
              </div>

              <button
                onClick={openCase}
                disabled={balance < CASE_COST || opening}
                className="w-full max-w-xs bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-900 font-extrabold py-4 rounded-2xl text-lg shadow-lg transition-colors"
              >
                {opening ? 'Opening…' : `Open Case — $${CASE_COST}`}
              </button>

              {lastDrop && (
                <div className={`w-full max-w-xs rounded-2xl p-4 bg-zinc-700 border-2 ${lastDrop.color.replace('bg-', 'border-')} text-center`}>
                  <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${lastDrop.textColor}`}>
                    {lastDrop.rarity}
                  </div>
                  <div className="font-bold text-lg">{lastDrop.name}</div>
                  <div className="text-zinc-300 text-sm">${lastDrop.value}</div>
                </div>
              )}
            </div>

            <div className="bg-zinc-800 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  Inventory <span className="text-zinc-400 text-base font-normal">({inventory.length})</span>
                </h2>
                {inventory.length > 0 && (
                  <button
                    onClick={sellAll}
                    className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-xl font-semibold transition-colors"
                  >
                    Sell All (${inventory.reduce((s, i) => s + i.value, 0).toLocaleString()})
                  </button>
                )}
              </div>

              {inventory.length === 0 ? (
                <div className="text-zinc-500 text-center py-8">No items yet. Open a case!</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {inventory.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-zinc-700 rounded-2xl px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
                        <div>
                          <div className="font-semibold text-sm">{item.name}</div>
                          <div className={`text-xs ${item.textColor}`}>{item.rarity}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => sellItem(item.id, item.value)}
                        className="bg-red-500 hover:bg-red-400 text-white text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors shrink-0"
                      >
                        ${item.value}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-800 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">Upgrades</h2>
              <div className="bg-zinc-700 rounded-2xl p-4">
                <div className="text-lg font-semibold mb-1">
                  Case Factory Lv.{upgradeLevel}
                </div>
                <div className="text-zinc-400 text-sm mb-3">
                  {upgradeLevel === 0
                    ? 'Buy to earn passive income every second.'
                    : `Earning $${upgradeLevel * 2}/sec passively.`}
                </div>
                <div className="text-zinc-300 text-sm mb-4">
                  Cost: <span className="text-white font-bold">${upgradeCost.toLocaleString()}</span>
                </div>
                <button
                  onClick={buyUpgrade}
                  disabled={balance < upgradeCost}
                  className="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed py-3 rounded-xl font-bold transition-colors"
                >
                  Buy Upgrade
                </button>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">Drop Rates</h2>
              <div className="space-y-2">
                {rarities.map(rarity => (
                  <div
                    key={rarity.name}
                    className="flex items-center justify-between bg-zinc-700 rounded-xl px-4 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${rarity.color}`} />
                      <span className="text-sm">{rarity.name}</span>
                    </div>
                    <span className="text-zinc-300 text-sm">{rarity.chance}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-800 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">Stats</h2>
              <div className="space-y-2 text-sm text-zinc-300">
                <div className="flex justify-between">
                  <span>Cases opened</span>
                  <span className="font-bold text-white">{inventory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Passive income</span>
                  <span className="font-bold text-green-400">${upgradeLevel * 2}/sec</span>
                </div>
                <div className="flex justify-between">
                  <span>Inventory value</span>
                  <span className="font-bold text-yellow-400">
                    ${inventory.reduce((s, i) => s + i.value, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
