import Sidebar from './sidebar'
import Image from 'next/image'

const activityItems = [
  {
    user: {
      name: 'Create Wallet',
      imageUrl:
        '',
    },
    projectName: 'ios-app',
    commit: '2d89f0c8',
    branch: 'main',
    date: '1h',
    dateTime: '2023-01-23T11:00',
  },
  {
    user: {
      name: 'Create Tree',
      imageUrl:
        '',
    },
    projectName: 'ios-app',
    commit: '2d89f0c8',
    branch: 'main',
    date: '1h',
    dateTime: '2023-01-23T11:00',
  },
  {
    user: {
      name: 'Create Tree',
      imageUrl:
        '',
    },
    projectName: 'ios-app',
    commit: '2d89f0c8',
    branch: 'main',
    date: '1h',
    dateTime: '2023-01-23T11:00',
  },
  {
    user: {
      name: 'Request Airdrop',
      imageUrl:
        '',
    },
    projectName: 'ios-app',
    commit: '2d89f0c8',
    branch: 'main',
    date: '1h',
    dateTime: '2023-01-23T11:00',
  }
]



export default function Layout({ children }:any) {
  
    return (
        <>
          <div className='dark'>
            <Sidebar/>
            <div className="xl:pl-72">
              <main className="lg:pr-96">
                {children}
              </main>
    
              {/* Activity feed */}
              <aside className="bg-black/10 lg:fixed lg:bottom-0 lg:right-0 lg:top-0 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5">
                <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                  <h2 className="text-base font-semibold leading-7 text-white">Activity feed</h2>
                  <a href="#" className="text-sm font-semibold leading-6 text-indigo-400">
                    View all
                  </a>
                </header>
                <ul role="list" className="divide-y divide-white/5">
                  {activityItems.map((item) => (
                    <li key={item.commit} className="px-4 py-4 sm:px-6 lg:px-8">
                      <div className="flex items-center gap-x-3">
                        <Image src="" alt="" className="h-6 w-6 flex-none rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500" />
                        <h3 className="flex-auto truncate text-sm font-semibold leading-6 text-white">{item.user.name}</h3>
                        <time dateTime={item.dateTime} className="flex-none text-xs text-gray-600">
                          {item.dateTime}
                        </time>
                      </div>
                      <p className="mt-3 truncate text-sm text-gray-500">
                        Pushed to <span className="text-gray-400">{item.projectName}</span> (
                        <span className="font-mono text-gray-400">{item.commit}</span> on{' '}
                        <span className="text-gray-400">{item.branch}</span>)
                      </p>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </div>
        </>
      )

}