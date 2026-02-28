import { schema, t, table } from "spacetimedb/server";

const users = table(
	{ public: true },
	{
		id: t.u64().primaryKey().autoInc(),
		identity: t.identity(),
		email: t.string(),
		displayName: t.string(),
		defaultCurrency: t.string(),
		createdAt: t.timestamp(),
	},
);

const budgets = table(
	{ public: true },
	{
		id: t.u64().primaryKey().autoInc(),
		userId: t.u64(),
		name: t.string(),
		currency: t.string(),
		createdAt: t.timestamp(),
	},
);

const spacetimedb = schema({
	users,
	budgets,
});
export default spacetimedb;

export const init = spacetimedb.init((_ctx) => {
	// Called when the module is initially published
});

export const onConnect = spacetimedb.clientConnected((_ctx) => {
	// Called every time a new client connects
});

export const onDisconnect = spacetimedb.clientDisconnected((_ctx) => {
	// Called every time a client disconnects
});

export const addUser = spacetimedb.reducer(
	{ email: t.string(), displayName: t.string(), defaultCurrency: t.string() },
	(ctx, { email, displayName, defaultCurrency }) => {
		ctx.db.users.insert({
			id: 0n,
			identity: ctx.sender,
			email,
			displayName,
			defaultCurrency,
			createdAt: ctx.timestamp,
		});
	},
);

export const addBudget = spacetimedb.reducer(
	{ userId: t.u64(), name: t.string(), currency: t.string() },
	(ctx, { userId, name, currency }) => {
		ctx.db.budgets.insert({
			id: 0n,
			userId,
			name,
			currency,
			createdAt: ctx.timestamp,
		});
	},
);
