import Head from 'next/head'

const newGroup = () => {
    return (
        <div>
            <Head>
                <title>Create Group</title>
            </Head>
            <form method="post">
                <input type="text" name="Group Name"></input>
                <input type="text" name="GroupLocation"></input>
                <button type="button">Add Users</button>
                <button type="button">Create Group</button>
            </form>
        </div>
    );
}

export default newGroup;