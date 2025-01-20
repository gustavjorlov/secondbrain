import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import natural from 'natural';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const contentDir = join(__dirname, '../src/content');
const outputPath = join(__dirname, '../src/content/search-index.json');

const tokenizer = new natural.WordTokenizer();
const stopwords = new Set(natural.stopwords);

// Technical words to keep
const technicalWords = new Set([
  // Programming Languages & Runtimes
  'javascript', 'typescript', 'python', 'java', 'ruby', 'php', 'rust', 'golang', 'node',
  'react', 'vue', 'angular', 'svelte', 'nextjs', 'nestjs', 'express', 'deno', 'kotlin',
  'scala', 'swift', 'objective-c', 'cpp', 'csharp', 'fsharp', 'clojure', 'erlang',
  'elixir', 'haskell', 'ocaml', 'perl', 'lua', 'dart', 'groovy', 'julia', 'r',
  'assembly', 'cobol', 'fortran', 'pascal', 'prolog', 'scheme', 'smalltalk',
  'webassembly', 'wasm', 'blazor', 'xamarin', 'flutter', 'ionic', 'cordova',
  'capacitor', 'electron', 'tauri',

  // Web Technologies
  'html', 'css', 'sass', 'scss', 'less', 'stylus', 'postcss', 'tailwind', 'bootstrap',
  'material', 'chakra', 'mantine', 'radix', 'storybook', 'styled-components', 'emotion',
  'webpack', 'babel', 'vite', 'rollup', 'esbuild', 'parcel', 'browserify', 'gulp',
  'grunt', 'npm', 'yarn', 'pnpm', 'nvm', 'npx', 'eslint', 'prettier', 'stylelint',
  'browserslist', 'polyfill', 'transpile', 'bundler', 'minify', 'uglify', 'sourcemap',
  'dom', 'shadow-dom', 'web-components', 'custom-elements', 'template', 'slot',
  'intersection-observer', 'mutation-observer', 'resize-observer', 'performance',
  'web-workers', 'service-workers', 'workbox', 'pwa', 'manifest', 'lighthouse',
  'analytics', 'seo', 'accessibility', 'aria', 'wcag', 'responsive', 'mobile-first',

  // Development Concepts
  'api', 'rest', 'graphql', 'http', 'websocket', 'tcp', 'udp', 'dns', 'ip', 'ftp',
  'smtp', 'imap', 'pop3', 'ssh', 'sftp', 'telnet', 'rpc', 'soap', 'xml', 'json',
  'yaml', 'toml', 'ini', 'csv', 'markdown', 'asciidoc', 'restructuredtext',
  'frontend', 'backend', 'fullstack', 'database', 'cache', 'proxy', 'reverse-proxy',
  'load-balancer', 'cdn', 'dns', 'domain', 'subdomain', 'tld', 'url', 'uri',
  'algorithm', 'middleware', 'framework', 'library', 'package', 'module', 'dependency',
  'component', 'hook', 'state', 'props', 'context', 'redux', 'flux', 'mobx', 'vuex',
  'pinia', 'zustand', 'recoil', 'jotai', 'xstate', 'rxjs', 'observable', 'promise',
  'async', 'await', 'callback', 'closure', 'scope', 'hoisting', 'prototype', 'class',
  'inheritance', 'polymorphism', 'encapsulation', 'abstraction', 'interface',
  'type', 'generic', 'enum', 'union', 'intersection', 'literal', 'tuple', 'readonly',
  'partial', 'pick', 'omit', 'record', 'exclude', 'extract', 'parameters', 'returntype',

  // Infrastructure & DevOps
  'docker', 'kubernetes', 'k8s', 'helm', 'istio', 'linkerd', 'consul', 'etcd',
  'prometheus', 'grafana', 'datadog', 'newrelic', 'splunk', 'elk', 'logstash',
  'kibana', 'fluentd', 'jaeger', 'zipkin', 'opentelemetry', 'opentracing',
  'aws', 'azure', 'gcp', 'digitalocean', 'heroku', 'netlify', 'vercel', 'cloudflare',
  'fastly', 'akamai', 'terraform', 'ansible', 'puppet', 'chef', 'vagrant', 'packer',
  'jenkins', 'gitlab', 'github', 'bitbucket', 'circleci', 'travis', 'teamcity',
  'bamboo', 'argocd', 'flux', 'spinnaker', 'harness', 'nginx', 'apache', 'caddy',
  'haproxy', 'traefik', 'envoy', 'kong', 'ambassador', 'linux', 'unix', 'windows',
  'macos', 'systemd', 'supervisor', 'pm2', 'forever', 'nodemon', 'docker-compose',
  'minikube', 'kind', 'k3s', 'k3d', 'microk8s', 'openshift', 'rancher', 'tanzu',

  // Database & Storage
  'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'mariadb', 'oracle', 'sqlite',
  'redis', 'memcached', 'elasticsearch', 'solr', 'cassandra', 'couchdb', 'dynamodb',
  'cosmosdb', 'firestore', 'neo4j', 'arangodb', 'orientdb', 'influxdb', 'timescaledb',
  'clickhouse', 'cockroachdb', 'vitess', 'citus', 'index', 'query', 'schema', 'model',
  'migration', 'orm', 'jdbc', 'jpa', 'hibernate', 'sequelize', 'prisma', 'typeorm',
  'mongoose', 'knex', 'objection', 'doctrine', 'eloquent', 'activerecord', 'entity',
  'repository', 'transaction', 'acid', 'cap', 'sharding', 'replication', 'partition',
  'backup', 'restore', 'snapshot', 'vacuum', 'analyze', 'explain', 'plan', 'trigger',
  'procedure', 'function', 'view', 'materialized', 'constraint', 'foreign-key',
  'primary-key', 'unique', 'index', 'btree', 'hash', 'gin', 'gist', 'spgist', 'brin',

  // Security & Authentication
  'auth', 'oauth', 'openid', 'saml', 'ldap', 'kerberos', 'jwt', 'token', 'cookie',
  'session', 'encryption', 'hash', 'salt', 'pepper', 'bcrypt', 'scrypt', 'argon2',
  'pbkdf2', 'rsa', 'dsa', 'ecdsa', 'ed25519', 'curve25519', 'aes', 'des', '3des',
  'tls', 'ssl', 'https', 'ssh', 'gpg', 'pgp', 'x509', 'ca', 'csr', 'crl', 'ocsp',
  'firewall', 'waf', 'ids', 'ips', 'siem', 'dlp', 'vpn', 'ipsec', 'openvpn',
  'wireguard', 'cors', 'xss', 'csrf', 'sqli', 'xxe', 'ssrf', 'rce', 'dos', 'ddos',
  'mitm', 'replay', 'timing', 'csrf-token', 'csp', 'hsts', 'oauth2', 'oidc',
  'mfa', '2fa', 'totp', 'hotp', 'u2f', 'webauthn', 'fido', 'fido2', 'yubikey',

  // Testing & Quality
  'test', 'unit', 'integration', 'e2e', 'acceptance', 'smoke', 'regression',
  'performance', 'load', 'stress', 'chaos', 'security', 'penetration', 'fuzzing',
  'mock', 'stub', 'spy', 'fake', 'dummy', 'fixture', 'factory', 'seed', 'snapshot',
  'jest', 'mocha', 'chai', 'jasmine', 'karma', 'cypress', 'selenium', 'playwright',
  'puppeteer', 'webdriver', 'testcafe', 'nightwatch', 'codecept', 'vitest', 'ava',
  'tap', 'tape', 'supertest', 'nock', 'sinon', 'enzyme', 'testing-library', 'msw',
  'coverage', 'istanbul', 'nyc', 'sonarqube', 'codeclimate', 'coveralls', 'codecov',
  'junit', 'testng', 'pytest', 'unittest', 'rspec', 'minitest', 'phpunit', 'xunit',
  'nunit', 'mstest', 'gtest', 'boost', 'catch2', 'doctest', 'quickcheck', 'property',

  // Architecture & Design Patterns
  'mvc', 'mvvm', 'mvp', 'flux', 'redux', 'solid', 'dry', 'kiss', 'yagni', 'pattern',
  'singleton', 'factory', 'abstract-factory', 'builder', 'prototype', 'adapter',
  'bridge', 'composite', 'decorator', 'facade', 'flyweight', 'proxy', 'chain',
  'command', 'interpreter', 'iterator', 'mediator', 'memento', 'observer', 'state',
  'strategy', 'template', 'visitor', 'module', 'revealing-module', 'namespace',
  'dependency-injection', 'ioc', 'service-locator', 'repository', 'unit-of-work',
  'specification', 'facade', 'adapter', 'bridge', 'composite', 'decorator',
  'microservice', 'monolith', 'serverless', 'event-driven', 'cqrs', 'event-sourcing',
  'saga', 'outbox', 'circuit-breaker', 'bulkhead', 'retry', 'timeout', 'fallback',
  'throttling', 'debouncing', 'rate-limiting', 'backpressure', 'load-shedding',

  // Version Control
  'git', 'svn', 'mercurial', 'perforce', 'tfs', 'commit', 'branch', 'merge',
  'rebase', 'cherry-pick', 'squash', 'amend', 'stash', 'pop', 'apply', 'drop',
  'reset', 'revert', 'checkout', 'fetch', 'pull', 'push', 'remote', 'origin',
  'upstream', 'fork', 'clone', 'tag', 'release', 'milestone', 'issue', 'pull-request',
  'merge-request', 'review', 'approve', 'reject', 'conflict', 'resolve', 'patch',
  'diff', 'blame', 'log', 'reflog', 'bisect', 'worktree', 'submodule', 'subtree',
  'gitflow', 'trunk-based', 'monorepo', 'polyrepo', 'conventional-commits',
  'semantic-release', 'changeset', 'lerna', 'nx', 'turborepo', 'rush', 'bazel',

  // Build & Package Management
  'npm', 'yarn', 'pnpm', 'gradle', 'maven', 'ant', 'make', 'cmake', 'ninja',
  'bazel', 'buck', 'pants', 'sbt', 'leiningen', 'cargo', 'pip', 'poetry', 'conda',
  'virtualenv', 'venv', 'pyenv', 'rbenv', 'rvm', 'nvm', 'nodenv', 'asdf', 'sdkman',
  'homebrew', 'apt', 'yum', 'dnf', 'pacman', 'chocolatey', 'scoop', 'winget',
  'nuget', 'pip', 'gem', 'composer', 'packagist', 'bower', 'jspm', 'duo',
  'artifactory', 'nexus', 'verdaccio', 'conan', 'vcpkg', 'homebrew', 'macports'
]);

// Common non-technical words to filter out
const commonStopwords = new Set([
  // Common verbs and adjectives
  'make', 'made', 'making', 'need', 'needs', 'needed',
  'want', 'wants', 'wanted', 'like', 'likes', 'liked',
  'see', 'sees', 'seen', 'show', 'shows', 'shown',
  'take', 'takes', 'taken', 'give', 'gives', 'given',
  'find', 'finds', 'found', 'think', 'thinks', 'thought',
  'good', 'better', 'best', 'bad', 'worse', 'worst',
  'high', 'higher', 'highest', 'low', 'lower', 'lowest',
  'big', 'bigger', 'biggest', 'small', 'smaller', 'smallest',
  
  // Common nouns and prepositions
  'thing', 'things', 'way', 'ways', 'time', 'times',
  'day', 'days', 'week', 'weeks', 'month', 'months',
  'year', 'years', 'place', 'places', 'person', 'people',
  'part', 'parts', 'kind', 'kinds', 'sort', 'sorts',
  'into', 'onto', 'under', 'over', 'about', 'through',
  'during', 'before', 'after', 'above', 'below',
  'will', 'would', 'could', 'should', 'must', 'may', 'might',
  
  // Common documentation words
  'note', 'notes', 'example', 'examples', 'sample', 'samples',
  'step', 'steps', 'guide', 'guides', 'tutorial', 'tutorials',
  'doc', 'docs', 'documentation', 'reference', 'references',
  'info', 'information', 'detail', 'details', 'overview',
  'summary', 'introduction', 'conclusion', 'section', 'sections'
]);

async function readMdxFiles() {
  try {
    const contentList = JSON.parse(
      await readFile(join(contentDir, 'content-list.json'), 'utf-8')
    );
    
    const fileContents = await Promise.all(
      contentList.map(async ({ name }) => {
        const content = await readFile(join(contentDir, `${name}.mdx`), 'utf-8');
        return { name, content };
      })
    );
    return fileContents;
  } catch (error) {
    console.error('Error reading MDX files:', error);
    globalThis.process.exit(1);
  }
}

function processContent(content) {
  // Remove code blocks
  content = content.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  content = content.replace(/`[^`]*`/g, '');
  // Remove URLs
  content = content.replace(/https?:\/\/[^\s)]+/g, '');
  // Remove HTML tags
  content = content.replace(/<[^>]*>/g, '');
  // Remove special characters and numbers
  content = content.replace(/[^a-zA-Z\s]/g, ' ');
  
  return content;
}

function isSignificantWord(word) {
  const lowerWord = word.toLowerCase();
  return (
    word.length > 2 && // Filter out short words
    !commonStopwords.has(lowerWord) &&
    !stopwords.has(lowerWord) &&
    (technicalWords.has(lowerWord) || // Keep known technical words
     /^[a-z]+(?:[A-Z][a-z]*)+$/.test(word) || // Keep camelCase words
     word.includes('-')) && // Keep hyphenated words
    isNaN(word) // Filter out numbers
  );
}

function getWordFrequencies(files) {
  const wordFrequencies = new Map();
  const wordToFiles = new Map();

  files.forEach(({ name, content }) => {
    const processedContent = processContent(content);
    const words = tokenizer.tokenize(processedContent) || [];
    
    const uniqueWords = new Set(
      words
        .map(word => word.toLowerCase())
        .filter(isSignificantWord)
    );

    uniqueWords.forEach(word => {
      wordFrequencies.set(word, (wordFrequencies.get(word) || 0) + 1);
      
      if (!wordToFiles.has(word)) {
        wordToFiles.set(word, new Set());
      }
      wordToFiles.get(word).add(name);
    });
  });

  return { wordFrequencies, wordToFiles };
}

async function generateSearchIndex() {
  try {
    const files = await readMdxFiles();
    const { wordFrequencies, wordToFiles } = getWordFrequencies(files);

    // Get top 25 words by frequency
    const topWords = Array.from(wordFrequencies.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25)
      .map(([word]) => word);

    // Create the final index
    const searchIndex = Object.fromEntries(
      topWords.map(word => [
        word,
        Array.from(wordToFiles.get(word))
      ])
    );

    // Save the index
    await writeFile(
      outputPath,
      JSON.stringify(searchIndex, null, 2),
      'utf-8'
    );

    console.log('Search index generated successfully!');
    console.log('Top 25 words:', topWords);
  } catch (error) {
    console.error('Error generating search index:', error);
    globalThis.process.exit(1);
  }
}

generateSearchIndex();
