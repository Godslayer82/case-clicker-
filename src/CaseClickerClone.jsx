import { useState, useEffect } from 'react';
                    onClick={() => sellItem(item.id, item.value)}
                    className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-xl font-semibold"
                  >
                    Sell ${item.value}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Upgrades</h2>

            <div className="bg-zinc-700 rounded-2xl p-4">
              <div className="text-lg font-semibold mb-2">
                Case Factory Lv.{upgradeLevel}
              </div>

              <div className="text-zinc-300 mb-4">
                Generates passive income every second.
              </div>

              <div className="mb-4">
                Upgrade Cost: ${500 + upgradeLevel * 500}
              </div>

              <button
                onClick={buyUpgrade}
                className="w-full bg-blue-500 hover:bg-blue-400 py-3 rounded-xl font-bold"
              >
                Buy Upgrade
              </button>
            </div>
          </div>

          <div className="bg-zinc-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Drop Rates</h2>

            <div className="space-y-2">
              {rarities.map((rarity) => (
                <div
                  key={rarity.name}
                  className="flex items-center justify-between bg-zinc-700 rounded-xl px-4 py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${rarity.color}`} />
                    <span>{rarity.name}</span>
                  </div>

                  <span>{rarity.chance}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
