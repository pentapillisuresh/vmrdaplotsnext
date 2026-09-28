'use client';

import React from 'react';
import { Home, Users, Handshake } from 'lucide-react';

const stats = [
  {
    icon: Home,
    value: '150+',
    label: 'Properties Listed',
  },
  {
    icon: Users,
    value: '100+',
    label: 'Happy Clients',
  },
  {
    icon: Handshake,
    value: '100+',
    label: 'Successful Deals',
  },
];

const StatsSection = () => {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-3
        gap-3
        sm:gap-4
        mt-10
        sm:mt-12
        md:mt-14
        max-w-4xl
        mx-auto
      "
      data-aos="fade-up"
      data-aos-delay="500"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="
              group
              relative
              bg-white
              rounded-xl
              sm:rounded-2xl
              border
              border-gray-100
              px-4
              py-4
              sm:px-5
              sm:py-5
              text-center
              shadow-[0_4px_20px_rgba(0,0,0,0.06)]
              hover:shadow-[0_10px_30px_rgba(0,0,0,0.10)]
              hover:-translate-y-1
              transition-all
              duration-300
              overflow-hidden
            "
          >
            {/* Premium top accent */}
            <div
              className="
                absolute
                top-0
                left-1/2
                -translate-x-1/2
                w-10
                h-[3px]
                bg-orange-500
                rounded-b-full
                group-hover:w-16
                transition-all
                duration-300
              "
            />

            {/* Icon */}
            <div
              className="
                flex
                items-center
                justify-center
                mx-auto
                w-10
                h-10
                sm:w-11
                sm:h-11
                rounded-xl
                bg-orange-50
                border
                border-orange-100
                mb-3
                group-hover:bg-orange-500
                group-hover:border-orange-500
                transition-all
                duration-300
              "
              data-aos="zoom-in"
              data-aos-delay={600 + index * 100}
            >
              <Icon
                className="
                  text-orange-500
                  w-5
                  h-5
                  group-hover:text-white
                  transition-colors
                  duration-300
                "
                strokeWidth={1.8}
              />
            </div>

            {/* Number */}
            <h3
              className="
                text-xl
                sm:text-2xl
                font-bold
                text-gray-900
                tracking-tight
                leading-none
              "
            >
              {stat.value}
            </h3>

            {/* Label */}
            <p
              className="
                text-gray-500
                text-[11px]
                sm:text-xs
                mt-2
                font-medium
                tracking-wide
              "
            >
              {stat.label}
            </p>

            {/* Bottom indicator */}
            <div
              className="
                w-6
                h-[2px]
                bg-orange-500
                mx-auto
                mt-3
                rounded-full
                opacity-60
                group-hover:w-10
                group-hover:opacity-100
                transition-all
                duration-300
              "
            />
          </div>
        );
      })}
    </div>
  );
};

export default StatsSection;