
'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Eye, Phone, Heart, Calendar, MapPin, Home } from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [viewsData, setViewsData] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [locationStats, setLocationStats] = useState([]);
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    setMetrics({
      totalViews: 3456,
      totalInquiries: 87,
      totalSaves: 234,
      avgViewsPerListing: 288,
      conversionRate: 2.5,
      viewsGrowth: 12.5
    });

    setViewsData([
      { date: 'Week 1', views: 420, inquiries: 12 },
      { date: 'Week 2', views: 680, inquiries: 18 },
      { date: 'Week 3', views: 890, inquiries: 25 },
      { date: 'Week 4', views: 1466, inquiries: 32 }
    ]);

    setTopPerformers([
      {
        id: 1,
        title: '3BHK Luxury Apartment',
        location: 'Rushikonda',
        views: 856,
        inquiries: 34,
        saves: 67,
        conversionRate: 4.0,
        image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 2,
        title: '2BHK Modern Apartment',
        location: 'MVP Colony',
        views: 734,
        inquiries: 28,
        saves: 54,
        conversionRate: 3.8,
        image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 3,
        title: 'Duplex House',
        location: 'Gajuwaka',
        views: 612,
        inquiries: 22,
        saves: 45,
        conversionRate: 3.6,
        image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ]);

    setLocationStats([
      { location: 'Rushikonda', listings: 3, views: 1234, inquiries: 45 },
      { location: 'MVP Colony', listings: 2, views: 987, inquiries: 38 },
      { location: 'Madhurawada', listings: 2, views: 756, inquiries: 28 },
      { location: 'Gajuwaka', listings: 2, views: 634, inquiries: 22 },
      { location: 'Dwaraka Nagar', listings: 1, views: 489, inquiries: 18 }
    ]);
  }, [timeRange]);

  const MetricCard = ({ icon: Icon, title, value, subtitle, trend, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">Track your property performance and insights</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            icon={Eye}
            title="Total Views"
            value={metrics.totalViews?.toLocaleString()}
            subtitle={`${metrics.avgViewsPerListing} avg per listing`}
            trend={metrics.viewsGrowth}
            color="bg-blue-500"
          />
          <MetricCard
            icon={Phone}
            title="Total Inquiries"
            value={metrics.totalInquiries}
            subtitle={`${metrics.conversionRate}% conversion rate`}
            trend={8.2}
            color="bg-green-500"
          />
          <MetricCard
            icon={Heart}
            title="Properties Saved"
            value={metrics.totalSaves}
            subtitle="By interested buyers"
            trend={15.3}
            color="bg-red-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Views & Inquiries Trend</h2>
            <div className="space-y-4">
              {viewsData.map((week, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{week.date}</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-blue-600">
                        <Eye className="w-4 h-4" />
                        {week.views}
                      </span>
                      <span className="flex items-center gap-1 text-green-600">
                        <Phone className="w-4 h-4" />
                        {week.inquiries}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${(week.views / 1500) * 100}%` }}
                      />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-green-500 h-full rounded-full"
                        style={{ width: `${(week.inquiries / 40) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-gray-600">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-gray-600">Inquiries</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Performance by Location</h2>
            <div className="space-y-4">
              {locationStats.map((stat, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{stat.location}</h3>
                        <p className="text-sm text-gray-600">{stat.listings} listings</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-blue-600 text-sm mb-1">
                        <Eye className="w-4 h-4" />
                        {stat.views}
                      </div>
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <Phone className="w-4 h-4" />
                        {stat.inquiries}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full"
                      style={{ width: `${(stat.views / 1500) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performing Listings</h2>
          <div className="space-y-4">
            {topPerformers.map((property, index) => (
              <div key={property.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full font-bold text-orange-600">
                  #{index + 1}
                </div>
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <Eye className="w-4 h-4" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{property.views}</p>
                    <p className="text-xs text-gray-500">Views</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <Phone className="w-4 h-4" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{property.inquiries}</p>
                    <p className="text-xs text-gray-500">Inquiries</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                      <Heart className="w-4 h-4" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{property.saves}</p>
                    <p className="text-xs text-gray-500">Saves</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{property.conversionRate}%</p>
                    <p className="text-xs text-gray-500">Conv. Rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
