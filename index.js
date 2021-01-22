const { Toolkit } = require('actions-toolkit')

// Run your GitHub Action!
Toolkit.run(async tools => {
    const commitMessage = ':memo: generated changelog'

    try {
        // set git user
        await tools.runInWorkspace('git',
            ['config', 'user.name', `"${process.env.GITHUB_USER || 'Automated Version Bump'}"`])
        await tools.runInWorkspace('git',
            ['config', 'user.email', `"${process.env.GITHUB_EMAIL || 'gh-action-bump-version@users.noreply.github.com'}"`])

        // run gitmoji changelog
        await tools.runInWorkspace('npx', ['gitmoji-changelog'])
        // commit changes
        await tools.runInWorkspace('git', ['commit', '-a', '-m', `${commitMessage}`])

        // push changes
        const remoteRepo = `https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`
        await tools.runInWorkspace('git', ['push', remoteRepo])
    } catch (e) {
        tools.log.fatal(e)
        tools.exit.failure('Failed to generate changelog')
    }
    tools.exit.success('Changelog generated!')
})