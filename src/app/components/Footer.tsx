function Footer() {
    return (
        <footer className="mt-12 pt-8 pb-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <p>
                    Based on the{" "}
                    <a
                        href="https://docs.google.com/spreadsheets/d/1x3YNRUwN7Fw-ewzQC58rop-hkObvy20FHSY1IKXkCM0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        TrialPears IdleOn Tome Spreadsheet
                    </a>
                    . They were the brainics that figured out the calculations, I just wanted an easier way to manage
                    sorting. Make sure you also show them some love!
                </p>
                <p>
                    Leaderboard accounts last updated:{" "}
                    {new Date(import.meta.env.VITE_LAST_LEADERBOARD_UPDATE).toDateString()}{" "}
                    {new Date(import.meta.env.VITE_LAST_LEADERBOARD_UPDATE).toTimeString().split(" ")[0]}
                </p>
                <div>
                    <a
                        href="https://github.com/Cephyric-gh/tome"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        View on GitHub
                    </a>
                </div>
                <p>
                    &copy; {new Date().getFullYear()}&nbsp;
                    <a
                        href="https://github.com/Cephyric-gh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        @cephyric-gh
                    </a>
                </p>
            </div>
        </footer>
    );
}

export default Footer;
