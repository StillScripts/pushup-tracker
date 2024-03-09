/** @type {import('next').NextConfig} */
import 'dotenv/config'
const nextConfig = {
	experimental: {
		typedRoutes: true
	},
	env: {
		DATABASE_URL: process.env.DATABASE_URL
	},

	// @ts-expect-error annoying...
	webpack: (config, { webpack }) => {
		config.plugins.push(
			new webpack.IgnorePlugin({
				resourceRegExp: /^pg-native$|^cloudflare:sockets$|^node:stream$/
			})
		)

		return config
	}
}

export default nextConfig
