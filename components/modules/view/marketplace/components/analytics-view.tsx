import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ContractInteraction } from './contract-interaction';
import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    DollarSign, 
    Clock, 
    Percent,
    Activity,
    Target,
    Award,
    Zap
} from 'lucide-react';

export function AnalyticsView() {
    // Mock analytics data - would come from API/contract events
    const analytics = {
        totalVolume: '124.5',
        totalListings: 247,
        activeTraders: 1856,
        avgDiscount: 18.3,
        totalTrades: 89,
        avgTradeTime: '2.4 hours',
        successRate: 94.2,
        popularPairs: [
            { pair: 'BNB/USDT', volume: '45.2 BNB', trades: 23 },
            { pair: 'CAKE/BNB', volume: '31.8 BNB', trades: 18 },
            { pair: 'BNB/BUSD', volume: '28.4 BNB', trades: 15 },
            { pair: 'ETH/BNB', volume: '19.1 BNB', trades: 12 }
        ],
        recentActivity: [
            { action: 'Purchase', pair: 'BNB/USDT', amount: '2.5 BNB', time: '5 min ago' },
            { action: 'Listing', pair: 'CAKE/BNB', amount: '1.8 BNB', time: '12 min ago' },
            { action: 'Completion', pair: 'BNB/BUSD', amount: '3.2 BNB', time: '25 min ago' },
            { action: 'Purchase', pair: 'ETH/BNB', amount: '4.1 BNB', time: '38 min ago' }
        ]
    };

    return (
        <div className="space-y-6">
            {/* Contract Testing Section */}
            <div>
                <h3 className="text-xl font-bold text-white font-mono mb-4">Contract Status</h3>
                <ContractInteraction listingId={1} />
            </div>

            {/* Key Metrics */}
            <div>
                <h3 className="text-xl font-bold text-white font-mono mb-4">Key Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 font-mono text-sm">Total Volume</p>
                                    <p className="text-2xl font-bold text-cyan-400 font-mono">{analytics.totalVolume} BNB</p>
                                    <p className="text-green-400 font-mono text-xs">+12.5% this week</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-cyan-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 font-mono text-sm">Total Listings</p>
                                    <p className="text-2xl font-bold text-green-400 font-mono">{analytics.totalListings}</p>
                                    <p className="text-green-400 font-mono text-xs">+8 today</p>
                                </div>
                                <BarChart3 className="w-8 h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 font-mono text-sm">Active Traders</p>
                                    <p className="text-2xl font-bold text-purple-400 font-mono">{analytics.activeTraders}</p>
                                    <p className="text-green-400 font-mono text-xs">+5.2% this month</p>
                                </div>
                                <Users className="w-8 h-8 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 font-mono text-sm">Avg. Discount</p>
                                    <p className="text-2xl font-bold text-orange-400 font-mono">{analytics.avgDiscount}%</p>
                                    <p className="text-orange-400 font-mono text-xs">savings for buyers</p>
                                </div>
                                <Percent className="w-8 h-8 text-orange-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Trading Performance */}
            <div>
                <h3 className="text-xl font-bold text-white font-mono mb-4">Trading Performance</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="text-white font-mono text-lg flex items-center space-x-2">
                                <Target className="w-5 h-5 text-blue-400" />
                                <span>Success Rate</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 font-mono">Trade Completion</span>
                                    <span className="text-green-400 font-mono font-bold">{analytics.successRate}%</span>
                                </div>
                                <Progress value={analytics.successRate} className="bg-slate-700" />
                                <p className="text-slate-400 font-mono text-sm">
                                    {analytics.totalTrades} completed trades
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="text-white font-mono text-lg flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-yellow-400" />
                                <span>Avg. Trade Time</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-yellow-400 font-mono">{analytics.avgTradeTime}</p>
                                <p className="text-slate-400 font-mono text-sm mt-2">
                                    From listing to completion
                                </p>
                                <Badge className="mt-3 bg-yellow-400/20 text-yellow-400 border-yellow-400/30 font-mono">
                                    Fast Settlement
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="text-white font-mono text-lg flex items-center space-x-2">
                                <Award className="w-5 h-5 text-emerald-400" />
                                <span>Platform Stats</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-mono text-sm">Total Fees Earned</span>
                                    <span className="text-emerald-400 font-mono font-bold">2.47 BNB</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-mono text-sm">Disputes Resolved</span>
                                    <span className="text-emerald-400 font-mono font-bold">3</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-mono text-sm">Uptime</span>
                                    <span className="text-emerald-400 font-mono font-bold">99.9%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Popular Trading Pairs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                        <CardTitle className="text-white font-mono text-lg flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-cyan-400" />
                            <span>Popular Trading Pairs</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.popularPairs.map((pair, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                    <div>
                                        <p className="text-white font-mono font-bold">{pair.pair}</p>
                                        <p className="text-slate-400 font-mono text-sm">{pair.trades} trades</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-cyan-400 font-mono font-bold">{pair.volume}</p>
                                        <p className="text-slate-400 font-mono text-sm">volume</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                        <CardTitle className="text-white font-mono text-lg flex items-center space-x-2">
                            <Activity className="w-5 h-5 text-green-400" />
                            <span>Recent Activity</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <Badge 
                                            variant="outline" 
                                            className={`font-mono text-xs ${
                                                activity.action === 'Purchase' ? 'text-blue-400 border-blue-400/30' :
                                                activity.action === 'Listing' ? 'text-green-400 border-green-400/30' :
                                                'text-purple-400 border-purple-400/30'
                                            }`}
                                        >
                                            {activity.action}
                                        </Badge>
                                        <div>
                                            <p className="text-white font-mono text-sm">{activity.pair}</p>
                                            <p className="text-slate-400 font-mono text-xs">{activity.time}</p>
                                        </div>
                                    </div>
                                    <p className="text-cyan-400 font-mono font-bold">{activity.amount}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
