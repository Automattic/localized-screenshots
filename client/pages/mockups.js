import React from 'react';
import { Outlet, Routes, Route, NavLink } from 'react-router-dom';
import { Tldraw } from '@tldraw/tldraw';
import languages from '/lib/languages';

function Page() {
	return (
		<div className="min-h-screen bg-slate-100">
			<nav className="bg-slate-700 px-4 py-3 flex justify-between items-center">
				<div className="font-bold text-white">
					<NavLink
						to="/mockups"
						className="flex items-center gap-2 bg-slate-600 bg-slate-600 text-white font-bold p-2 border border-slate-500 rounded"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={ 1.5 }
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
							/>
						</svg>
						Localized Screenshots
					</NavLink>
				</div>

				<div className="flex items-center gap-2">
					<NavLink
						to="/mockups"
						end
						className={ ( { isActive } ) =>
							`flex items-center gap-2 ${
								isActive ? 'bg-sky-600' : 'hover:bg-slate-600'
							} text-white font-bold py-2 px-4 rounded`
						}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={ 1.5 }
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
							/>
						</svg>
						New Screenshot
					</NavLink>

					<NavLink
						to="/mockups/edit"
						className={ ( { isActive } ) =>
							`flex items-center gap-2 ${
								isActive ? 'bg-sky-600' : 'hover:bg-slate-600'
							} text-white font-bold py-2 px-4 rounded`
						}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={ 1.5 }
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
							/>
						</svg>
						Browse Screenshots
					</NavLink>
				</div>
			</nav>

			<Outlet />
		</div>
	);
}

function Home() {
	return (
		<div className="p-4 text-center">
			<div className="inline-flex gap-4 items-end p-8 bg-white rounded-md shadow-md text-left">
				<label className="w-64">
					<span className="block text-slate-600 text-sm mb-2">
						Site:
					</span>
					<select className="block w-full rounded-md border-slate-300 focus:border-slate-400 focus:ring focus:ring-slate-600 focus:ring-opacity-10">
						<option>WordPress.com</option>
						<option>WordPress.com</option>
					</select>
				</label>

				<label className="w-64">
					<span className="block text-slate-600 text-sm mb-2">
						Resolution:
					</span>
					<select className="block w-full rounded-md border-slate-300 focus:border-slate-400 focus:ring focus:ring-slate-600 focus:ring-opacity-10">
						<option>768x1024</option>
						<option selected>1280x800</option>
						<option>1920x1080</option>
					</select>
				</label>

				<NavLink
					to="/mockups/create"
					className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 border border-emerald-700 rounded"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={ 1.5 }
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
						/>
					</svg>
					Start Session
				</NavLink>
			</div>

			<button className="flex items-center justify-center gap-2 mx-auto mt-2 bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 border border-slate-500 rounded">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={ 1.5 }
					stroke="currentColor"
					className="w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
					/>
				</svg>
				How to use?
			</button>
		</div>
	);
}

function EditItem() {
	return (
		<tr className="hover:bg-slate-50">
			<td
				className="border-t border-slate-200 align-middle py-4 px-2"
				style={ { width: 250 } }
			>
				<img
					src="https://placehold.co/600x400"
					className="rounded-md w-full"
				/>
			</td>
			<td className="border-t border-slate-200 align-middle py-4 px-2">
				<input
					className="w-full bg-gray-100 px-4 py-2 rounded"
					value="https://wordpress.com/me/account"
				/>
			</td>
			<td className="border-t border-slate-200 align-middle py-4 px-2">
				<a
					href="https://wordpress.com/support/account-settings/"
					className="text-sky-700 underline hover:no-underline"
				>
					Account Settings
				</a>
			</td>
			<td className="border-t border-slate-200 align-middle py-4 px-2">
				<a
					href="https://wordpress.com/support/account-settings/"
					className="text-sky-700 bg-sky-100 hover:bg-sky-50 px-2 py-1 rounded"
				>
					@John Doe
				</a>
			</td>
			<td className="border-t border-slate-200 align-middle py-4 px-2">
				16th March, 2022
			</td>
			<td className="border-t border-slate-200 align-middle py-4 px-2">
				<div className="flex flex-wrap items-center gap-1">
					<button className="bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold text-xs px-4 py-1 rounded-full">
						Edit
					</button>
					<button className="bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold text-xs px-4 py-1 rounded-full">
						Replace
					</button>
					<button className="bg-slate-200 hover:bg-red-700 hover:text-white text-slate-600 font-bold text-xs px-4 py-1 rounded-full">
						Delete
					</button>
				</div>
			</td>
		</tr>
	);
}

function Edit() {
	return (
		<div className="p-4">
			<div className="relative mb-4">
				<div className="absolute h-full left-2 flex items-center text-slate-400 pointer-events-none">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={ 1.5 }
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
						/>
					</svg>
				</div>

				<input
					type="text"
					className="w-1/3 bg-white pl-10 border-white rounded-full shadow"
					placeholder="Search&hellip;"
				/>
			</div>

			<div className="px-4 pt-2 bg-white rounded-md shadow-xl">
				<table className="border-collapse table-auto w-full text-sm">
					<thead>
						<tr>
							<th className="py-2 px-4">
								<h4 className="text-slate-600 font-bold flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={ 1.5 }
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
										/>
									</svg>
									Screenshot
								</h4>
							</th>
							<th className="py-2 px-4">
								<h4 className="text-slate-600 font-bold flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={ 1.5 }
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
										/>
									</svg>
									URL
								</h4>
							</th>
							<th className="py-2 px-4">
								<h4 className="text-slate-600 font-bold flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={ 1.5 }
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
										/>
									</svg>
									Used in
								</h4>
							</th>
							<th className="py-2 px-4">
								<h4 className="text-slate-600 font-bold flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={ 1.5 }
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									Created by
								</h4>
							</th>
							<th className="py-2 px-4">
								<h4 className="text-slate-600 font-bold flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={ 1.5 }
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
										/>
									</svg>
									Date
								</h4>
							</th>
							<th className="py-2 px-4">
								<h4 className="text-slate-600 font-bold flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={ 1.5 }
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									Actions
								</h4>
							</th>
						</tr>
					</thead>

					<tbody>
						<EditItem />
						<EditItem />
						<EditItem />
						<EditItem />
						<EditItem />
					</tbody>
				</table>
			</div>

			<nav className="flex items-stretch gap-1 mt-4">
				<a
					href="#"
					className="relative inline-flex items-center p-2 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-600"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={ 1.5 }
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 19.5L8.25 12l7.5-7.5"
						/>
					</svg>
				</a>

				<a
					href="#"
					className="relative inline-flex items-center py-2 px-4 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-600"
				>
					1
				</a>

				<a
					href="#"
					className="relative inline-flex items-center py-2 px-4 bg-slate-600 border border-slate-600 rounded text-white pointer-events-none"
				>
					2
				</a>

				<span className="px-2 text-slate-400">&hellip;</span>

				<a
					href="#"
					className="relative inline-flex items-center py-2 px-4 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-600"
				>
					9
				</a>

				<a
					href="#"
					className="relative inline-flex items-center py-2 px-4 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-600"
				>
					10
				</a>

				<a
					href="#"
					className="relative inline-flex items-center p-2 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-600"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={ 1.5 }
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M8.25 4.5l7.5 7.5-7.5 7.5"
						/>
					</svg>
				</a>
			</nav>
		</div>
	);
}

function Create() {
	const [ macro, setMacro ] = React.useState( false );

	return (
		<div className="flex items-stetch h-screen">
			<div className="w-64 p-2 bg-slate-800 border-t border-slate-600 text-white">
				<div className="mb-2 pb-2 border-b border-slate-600">
					<h4 className="flex items-center justify-between mb-2 pb-2 text-slate-100 text-base border-b border-slate-600">
						<span>Macro Action:</span>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={ 1.5 }
							stroke="currentColor"
							className="w-6 h-6 cursor-pointer text-slate-400 hover:text-sky-600"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
							/>
						</svg>
					</h4>

					{ macro && (
						<ol className="list-none p-2 mb-2 bg-slate-700 border border-slate-600 rounded">
							<li className="flex items-start mb-1 pb-1 border-b border-dotted border-slate-500">
								<div className="flex items-center flex-nowrap mr-2 text-yellow-200 text-[11px]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 15 15"
										strokeWidth={ 1.5 }
										stroke="currentColor"
										className="w-4 h-4 mr-1"
									>
										<path d="M7.5 4v3m0 7.5a5 5 0 01-5-5v-4a5 5 0 0110 0v4a5 5 0 01-5 5z" />
									</svg>

									<span className="uppercase">click</span>
								</div>
								<span className="font-mono text-slate-400 text-[10px] truncate">
									body{ ' ' }
									<span className="text-slate-500">
										&rsaquo;
									</span>{ ' ' }
									.container{ ' ' }
									<span className="text-slate-500">
										&rsaquo;
									</span>
									.logo-link
								</span>
							</li>
							<li className="flex items-start mb-1 pb-1 border-b border-dotted border-slate-500">
								<div className="flex items-center flex-nowrap mr-2 text-yellow-200 text-[11px] leading-3">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										viewBox="0 0 576 512"
										className="w-4 h-4 mr-1"
									>
										<path d="M512 64H64C28.65 64 0 92.65 0 128v256c0 35.35 28.65 64 64 64h448c35.35 0 64-28.65 64-64V128c0-35.35-28.7-64-64-64zm16 320c0 8.822-7.178 16-16 16H64c-8.822 0-16-7.178-16-16V128c0-8.822 7.178-16 16-16h448c8.822 0 16 7.178 16 16v256zM140 152h-24c-6.656 0-12 5.344-12 12v24c0 6.656 5.344 12 12 12h24c6.656 0 12-5.344 12-12v-24c0-6.7-5.3-12-12-12zm56 48h24c6.656 0 12-5.344 12-12v-24c0-6.656-5.344-12-12-12h-24c-6.656 0-12 5.344-12 12v24c0 6.7 5.3 12 12 12zm80 0h24c6.656 0 12-5.344 12-12v-24c0-6.656-5.344-12-12-12h-24c-6.656 0-12 5.344-12 12v24c0 6.7 5.3 12 12 12zm80 0h24c6.656 0 12-5.344 12-12v-24c0-6.656-5.344-12-12-12h-24c-6.656 0-12 5.344-12 12v24c0 6.7 5.3 12 12 12zm104-48h-24c-6.656 0-12 5.344-12 12v24c0 6.656 5.344 12 12 12h24c6.656 0 12-5.344 12-12v-24c0-6.7-5.3-12-12-12zm-320 80h-24c-6.656 0-12 5.344-12 12v24c0 6.656 5.344 12 12 12h24c6.656 0 12-5.344 12-12v-24c0-6.7-5.3-12-12-12zm56 48h24c6.656 0 12-5.344 12-12v-24c0-6.656-5.344-12-12-12h-24c-6.656 0-12 5.344-12 12v24c0 6.7 5.3 12 12 12zm80 0h24c6.656 0 12-5.344 12-12v-24c0-6.656-5.344-12-12-12h-24c-6.656 0-12 5.344-12 12v24c0 6.7 5.3 12 12 12zm80 0h24c6.656 0 12-5.344 12-12v-24c0-6.656-5.344-12-12-12h-24c-6.656 0-12 5.344-12 12v24c0 6.7 5.3 12 12 12zm104-48h-24c-6.656 0-12 5.344-12 12v24c0 6.656 5.344 12 12 12h24c6.656 0 12-5.344 12-12v-24c0-6.7-5.3-12-12-12zm-60 88H176c-8.9 0-16 7.1-16 16v16c0 8.875 7.125 16 16 16h224c8.875 0 16-7.125 16-16v-16c0-8.9-7.1-16-16-16z" />
									</svg>

									<span className="uppercase">key press</span>
								</div>
								<span className="font-mono text-slate-400 text-[10px]">
									Escape
								</span>
							</li>
							<li className="flex items-start mb-1 pb-1 border-b border-dotted border-slate-500">
								<div className="flex items-center flex-nowrap mr-2 text-yellow-200 text-[11px] leading-3">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										viewBox="0 0 576 512"
										className="w-4 h-4 mr-1"
									>
										<path d="M512 64H64C28.65 64 0 92.65 0 128v256c0 35.35 28.65 64 64 64h448c35.35 0 64-28.65 64-64V128c0-35.35-28.7-64-64-64zm16 320c0 8.822-7.178 16-16 16H64c-8.822 0-16-7.178-16-16V128c0-8.822 7.178-16 16-16h448c8.822 0 16 7.178 16 16v256zM140 152h-24c-6.656 0-12 5.344-12 12v24c0 6.656 5.344 12 12 12h24c6.656 0 12-5.344 12-12v-24c0-6.7-5.3-12-12-12zm56 48h24c6.656 0 12-5.344 12-12v-24c0-6.656-5.344-12-12-12h-24c-6.656 0-12 5.344-12 12v24c0 6.7 5.3 12 12 12zm80 0h24c6.656 0 12-5.344 12-12v-24c0-6.656-5.344-12-12-12h-24c-6.656 0-12 5.344-12 12v24c0 6.7 5.3 12 12 12zm80 0h24c6.656 0 12-5.344 12-12v-24c0-6.656-5.344-12-12-12h-24c-6.656 0-12 5.344-12 12v24c0 6.7 5.3 12 12 12zm104-48h-24c-6.656 0-12 5.344-12 12v24c0 6.656 5.344 12 12 12h24c6.656 0 12-5.344 12-12v-24c0-6.7-5.3-12-12-12zm-320 80h-24c-6.656 0-12 5.344-12 12v24c0 6.656 5.344 12 12 12h24c6.656 0 12-5.344 12-12v-24c0-6.7-5.3-12-12-12zm56 48h24c6.656 0 12-5.344 12-12v-24c0-6.656-5.344-12-12-12h-24c-6.656 0-12 5.344-12 12v24c0 6.7 5.3 12 12 12zm80 0h24c6.656 0 12-5.344 12-12v-24c0-6.656-5.344-12-12-12h-24c-6.656 0-12 5.344-12 12v24c0 6.7 5.3 12 12 12zm80 0h24c6.656 0 12-5.344 12-12v-24c0-6.656-5.344-12-12-12h-24c-6.656 0-12 5.344-12 12v24c0 6.7 5.3 12 12 12zm104-48h-24c-6.656 0-12 5.344-12 12v24c0 6.656 5.344 12 12 12h24c6.656 0 12-5.344 12-12v-24c0-6.7-5.3-12-12-12zm-60 88H176c-8.9 0-16 7.1-16 16v16c0 8.875 7.125 16 16 16h224c8.875 0 16-7.125 16-16v-16c0-8.9-7.1-16-16-16z" />
									</svg>

									<span className="uppercase">type</span>
								</div>
								<span className="font-mono text-slate-400 text-[10px]">
									"John Doe"
								</span>
							</li>
							<li className="flex items-start">
								<div className="flex items-center flex-nowrap mr-2 text-yellow-200 text-[11px]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 15 15"
										strokeWidth={ 1.5 }
										stroke="currentColor"
										className="w-4 h-4 mr-1"
									>
										<path d="M7.5 4v3m0 7.5a5 5 0 01-5-5v-4a5 5 0 0110 0v4a5 5 0 01-5 5z" />
									</svg>

									<span className="uppercase">click</span>
								</div>
								<span className="font-mono text-slate-400 text-[10px]">
									.container{ ' ' }
									<span className="text-slate-500">
										&rsaquo;
									</span>{ ' ' }
									.submit
								</span>
							</li>
						</ol>
					) }

					<button
						className="flex items-center justify-center gap-2 w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 border border-slate-600 rounded"
						onClick={ () => setMacro( true ) }
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={ 1.5 }
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
							/>
						</svg>
						Record Actions
					</button>
				</div>

				<NavLink
					to="/mockups/create/step-2"
					className="flex items-center justify-center gap-2 w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 border border-sky-600 rounded"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={ 1.5 }
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
						/>
					</svg>
					Take Screenshots
				</NavLink>
			</div>

			<div className="grow p-4 pt-8">
				<div className="relative container mx-auto border border-slate-300 shadow-md rounded-md">
					<div className="bg-slate-200 border-b border-slate-300 rounded-t-md px-4 py-2">
						<input
							type="text"
							className="w-full bg-slate-300 border-0 rounded-full text-xs text-slate-500"
							value="https://wordpress.com/account/me"
							disabled
						/>
					</div>

					<iframe
						src="https://example.com"
						width="100%"
						className="rounded-b-md"
						style={ { aspectRatio: '16/9' } }
					/>

					<ResizeButtons />
				</div>
			</div>
		</div>
	);
}

function LanguagesSelector() {
	return (
		<div className="mb-2">
			<h4 className="flex items-center justify-between mb-2 pb-2 text-slate-100 text-base border-b border-slate-600">
				<span>Languages:</span>

				<button className="bg-slate-600 hover:bg-slate-500 text-slate-200 text-xs px-4 py-1 rounded-full">
					Select All
				</button>
			</h4>

			{ languages.map( ( lang ) => (
				<label className="flex p-1 items-center cursor-pointer hover:bg-slate-700 hover:border-slate-600 rounded-sm">
					<input
						type="checkbox"
						className="bg-slate-600 mr-2 rounded-sm"
						value={ lang.slug }
						defaultChecked
					/>
					<span>{ lang.name }</span>
				</label>
			) ) }
		</div>
	);
}

function ProgressBar( { onFinish } ) {
	const [ progress, setProgress ] = React.useState( 0 );
	const mockSteps = [
		'change user language',
		'navigate to "https://wordpress.com/me"',
		'taking screenshot',
	];

	React.useEffect( () => {
		const interval = setInterval( () => {
			setProgress( ( progress ) => {
				if ( progress === mockSteps.length * languages.length - 1 ) {
					clearInterval( interval );
					onFinish && onFinish();
					return progress;
				}

				return progress + 1;
			} );
		}, 100 );
	}, [] );

	const currentLanguageIndex = Math.floor( progress / 3 );
	const progressPercentage = Math.round(
		( 100 * progress ) / ( languages.length * mockSteps.length - 1 )
	);

	return (
		<div className="mt-4">
			<div className="bg-slate-600 h-2 rounded-md">
				<div
					className="h-full bg-sky-500 rounded-md transition-all"
					style={ { width: `${ progressPercentage }%` } }
				></div>
			</div>

			<div className="mt-1 text-slate-300 text-center">
				{ progressPercentage }% ({ currentLanguageIndex + 1 }/
				{ languages.length })
			</div>

			<div className="text-xs text-slate-400">
				<strong>
					Generating { languages[ currentLanguageIndex ].name }
					&hellip;
				</strong>

				{ mockSteps
					.slice( 0, ( progress % mockSteps.length ) + 1 )
					.map( ( step ) => (
						<>
							<br /> &rsaquo; { step }
						</>
					) ) }
			</div>
		</div>
	);
}

function ResizeButtons() {
	return (
		<>
			<button className="absolute left-full top-1/2 flex items-center bg-slate-200 hover:bg-slate-100 border border-slate-300 rounded-r">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={ 1.5 }
					stroke="currentColor"
					className="w-6 h-6 rotate-90"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
					/>
				</svg>
			</button>

			<button className="absolute right-full top-1/2 flex items-center bg-slate-200 hover:bg-slate-100 border border-slate-300 rounded-l">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={ 1.5 }
					stroke="currentColor"
					className="w-6 h-6 rotate-90"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
					/>
				</svg>
			</button>

			<button className="absolute top-full left-1/2 flex items-center bg-slate-200 hover:bg-slate-100 border border-slate-300 rounded-b">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={ 1.5 }
					stroke="currentColor"
					className="w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
					/>
				</svg>
			</button>

			<button className="absolute bottom-full left-1/2 flex items-center bg-slate-200 hover:bg-slate-100 border border-slate-300 rounded-t">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={ 1.5 }
					stroke="currentColor"
					className="w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
					/>
				</svg>
			</button>
		</>
	);
}

function CreateStep2() {
	const [ isGenerating, setIsGenerating ] = React.useState( false );
	const [ hasGenerated, setHasGenerated ] = React.useState( false );
	const [ saved, setSaved ] = React.useState( false );

	return (
		<div className="flex items-stetch h-screen">
			<div className="w-64 p-2 bg-slate-800 border-t border-slate-600 text-white">
				{ ! hasGenerated && (
					<>
						<div
							className={ `${
								isGenerating
									? 'opacity-25 pointer-events-none'
									: ''
							}` }
						>
							<LanguagesSelector />

							<button
								className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 border border-emerald-600 rounded"
								onClick={ () => setIsGenerating( true ) }
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={ 1.5 }
									stroke="currentColor"
									className="w-6 h-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
									/>
								</svg>
								Generate Screenshots
							</button>
						</div>

						{ ! isGenerating && (
							<div className="mt-2 text-xs text-slate-400">
								Lorem, ipsum dolor sit amet, consectetur
								adipisicing elit. Earum deserunt quam modi
								facere, inventore placeat?
							</div>
						) }

						{ isGenerating && (
							<ProgressBar
								onFinish={ () => setHasGenerated( true ) }
							/>
						) }
					</>
				) }

				{ hasGenerated && (
					<>
						<ol className="list-none">
							<li className="relative mb-2 border-2 border-sky-500 hover:border-sky-500 rounded-md overflow-hidden cursor-pointer">
								<img
									src="https://placehold.co/600x400"
									className="w-full"
								/>

								<span className="absolute left-2 top-2 bg-white py-1 px-2 shadow-md text-slate-600 rounded">
									English
								</span>
							</li>
							<li className="relative mb-2 border-2 hover:border-sky-500 rounded-md overflow-hidden cursor-pointer">
								<img
									src="https://placehold.co/600x400"
									className="w-full"
								/>

								<span className="absolute left-2 top-2 bg-white py-1 px-2 shadow-md text-slate-600 rounded">
									Spanish
								</span>
							</li>
							<li className="relative mb-2 border-2 hover:border-sky-500 rounded-md overflow-hidden cursor-pointer">
								<img
									src="https://placehold.co/600x400"
									className="w-full"
								/>

								<span className="absolute left-2 top-2 bg-white py-1 px-2 shadow-md text-slate-600 rounded">
									German
								</span>
							</li>
							<li className="relative mb-2 border-2 hover:border-sky-500 rounded-md overflow-hidden cursor-pointer">
								<img
									src="https://placehold.co/600x400"
									className="w-full"
								/>

								<span className="absolute left-2 top-2 bg-white py-1 px-2 shadow-md text-slate-600 rounded">
									French
								</span>
							</li>
						</ol>

						<button
							className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 border border-emerald-600 rounded"
							onClick={ () => setSaved( true ) }
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={ 1.5 }
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
								/>
							</svg>
							Save
						</button>
					</>
				) }
			</div>
			<div className="grow p-4 pt-8">
				{ saved && (
					<div className="container mx-auto mb-8 p-4 bg-emerald-50 border border-emerald-400 rounded">
						<div className="text-center mb-2">
							Screenshots were saved successfully.
						</div>

						<div className="flex items-stretch justify-center relative mb-4">
							<input
								type="text"
								className="w-1/3 bg-white px-4 border-white rounded-l-full shadow"
								value="https://localizedscreenshotsteststoragesite1.wpcomstaging.com/screenshot/screenshot-slug"
								disabled
							/>
							<button className="flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 border border-slate-600 rounded-r-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={ 1.5 }
									stroke="currentColor"
									className="w-6 h-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
									/>
								</svg>
								Copy Link
							</button>
						</div>
					</div>
				) }

				<div className="container mx-auto border border-slate-300 shadow-md rounded-md">
					<div className="relative">
						<Tldraw showMenu={ false } showPages={ false } />

						<iframe
							src="https://example.com"
							width="100%"
							className="rounded-b-md"
							style={ { aspectRatio: '16/9' } }
						/>

						<ResizeButtons />
					</div>
				</div>
			</div>
		</div>
	);
}

export default function PageMockups() {
	return (
		<Routes>
			<Route path="/" element={ <Page /> }>
				<Route path="/" element={ <Home /> } />
				<Route path="create" element={ <Create /> } />
				<Route path="create/step-2" element={ <CreateStep2 /> } />
				<Route path="edit" element={ <Edit /> } />
			</Route>
		</Routes>
	);
}
