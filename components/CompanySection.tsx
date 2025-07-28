"use client";

import Image from "next/image";

export default function TopEmployersSection() {
  const employers = [
    { name: "Yoma", logo: "/yoma.png" },
    { name: "ATOM", logo: "/dksh.png" },
    { name: "Carlsberg", logo: "/carls.png" },
    { name: "CocaCola", logo: "/cola.png" },
    { name: "Heineken", logo: "/hnk.png" },
    { name: "AIA", logo: "/aya.png" },
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Top Employers</h2>
        <p className="text-gray-600 mb-10">
          Companies actively hiring and trusted by job seekers
        </p>

        <div className="flex flex-wrap justify-center items-center gap-2">
          {employers.map((employer, index) => (
            <div key={index} className="w-36 sm:w-40 md:w-44 text-center">
              <Image
                src={employer.logo}
                alt={employer.name}
                width={180}
                height={180}
                className="mx-auto object-contain h-24"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
