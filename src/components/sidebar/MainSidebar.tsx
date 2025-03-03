import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from './categories';

export default function MainSidebar() {
  const pathname = usePathname();
  
  return (
    <div className="w-full h-full bg-white/80 backdrop-blur-md shadow-lg">
      <div className="p-4 border-b border-gray-200/50">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xl font-bold text-gray-800"
        >
          <img src="/favicon.ico" alt="logo" className="w-6 h-6" />
          Van's Dev Blog
        </Link>
      </div>

      <nav className="p-6 space-y-8">
        {Object.entries(categories).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
              {category}
            </h2>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.path}>
                  <Link 
                    href={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-all duration-200 group
                      ${pathname.startsWith(item.path)
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <item.icon 
                      className={`w-5 h-5 transition-all duration-200
                        ${pathname.startsWith(item.path)
                          ? 'text-white'
                          : 'text-gray-400 group-hover:[&>path]:fill-[var(--icon-color)]'
                        }
                        group-hover:scale-110
                      `} 
                      style={{ 
                        '--icon-color': item.color
                      } as React.CSSProperties}
                    />
                    <span className={`font-medium group-hover:text-gray-900`}>
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
} 