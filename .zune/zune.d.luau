-- This file was auto-generated with "zune-docs"

--[[ serde ]]
export type SerdeJsonEncodeConfig = {
    pretty_indent: number?,
}
export type SerdeJsonDecodeConfig = {
    preserve_null: boolean?,
}
type YamlInput = string | number | boolean | {
    [string]: YamlInput
}
type YamlOuput = string | {
    [string]: YamlOuput
}
export type SerdeGenericCompressionOptions = {
    level: number?,
}
type AdvancedCompressionFn =
    & ((raw: string, opts: SerdeGenericCompressionOptions?) -> string)
    & ((raw: buffer, opts: SerdeGenericCompressionOptions?) -> buffer)
    & ((raw: string | buffer, opts: SerdeGenericCompressionOptions?) -> string | buffer)
type DecompressionFn =
    & ((compressed: string) -> string)
    & ((compressed: buffer) -> buffer)
    & ((compressed: string | buffer) -> string | buffer)
export type _zune_serde_json = {
    encode: (value: any, config: SerdeJsonEncodeConfig?) -> string,
    decode: (json: string, config: SerdeJsonDecodeConfig?) -> any,
    indents: {
        none: number,
        two_spaces: number,
        four_spaces: number,
        tabs: number,
    },
    values: {
        null: any,
    }
}
export type _zune_serde_json5 = {
    encode: (value: any, config: SerdeJsonEncodeConfig?) -> string,
    decode: (json: string, config: SerdeJsonDecodeConfig?) -> any,
    indents: {
        none: number,
        two_spaces: number,
        four_spaces: number,
        tabs: number,
    },
    values: {
        null: any,
    }
}
export type _zune_serde_toml = {
    encode: (object: {[string]: any}) -> string,
    decode: (toml: string | buffer) -> {[string]: any},
}
export type _zune_serde_yaml = {
    encode: (object: YamlInput) -> string,
    decode: (yaml: string | buffer) -> YamlOuput,
}
export type _zune_serde_base64 = {
    encode:
        & ((value: string) -> string)
        & ((value: buffer) -> buffer)
        & ((value: string | buffer) -> string | buffer),
    decode:
        & ((base64: string) -> string)
        & ((base64: string | buffer) -> string | buffer),
}
export type _zune_serde_gzip = {
    compress:
        & ((raw: string, opts: SerdeGenericCompressionOptions?) -> string)
        & ((raw: buffer, opts: SerdeGenericCompressionOptions?) -> buffer)
        & ((raw: string | buffer, opts: SerdeGenericCompressionOptions?) -> string | buffer),
    decompress:
        & ((compressed: string) -> string)
        & ((compressed: buffer) -> buffer)
        & ((compressed: string | buffer) -> string | buffer),
}
export type _zune_serde_flate = {
    compress:
        & ((raw: string, opts: SerdeGenericCompressionOptions?) -> string)
        & ((raw: buffer, opts: SerdeGenericCompressionOptions?) -> buffer)
        & ((raw: string | buffer, opts: SerdeGenericCompressionOptions?) -> string | buffer),
    decompress:
        & ((compressed: string) -> string)
        & ((compressed: buffer) -> buffer)
        & ((compressed: string | buffer) -> string | buffer),
}
export type _zune_serde_zlib = {
    compress:
        & ((raw: string, opts: SerdeGenericCompressionOptions?) -> string)
        & ((raw: buffer, opts: SerdeGenericCompressionOptions?) -> buffer)
        & ((raw: string | buffer, opts: SerdeGenericCompressionOptions?) -> string | buffer),
    decompress:
        & ((compressed: string) -> string)
        & ((compressed: buffer) -> buffer)
        & ((compressed: string | buffer) -> string | buffer),
}
export type _zune_serde_brotli = {
    compress:
        & ((raw: string, opts: SerdeGenericCompressionOptions?) -> string)
        & ((raw: buffer, opts: SerdeGenericCompressionOptions?) -> buffer)
        & ((raw: string | buffer, opts: SerdeGenericCompressionOptions?) -> string | buffer),
    decompress:
        & ((compressed: string) -> string)
        & ((compressed: buffer) -> buffer)
        & ((compressed: string | buffer) -> string | buffer),
}
export type _zune_serde_zstd = {
    compress:
        & ((raw: string, opts: SerdeGenericCompressionOptions?) -> string)
        & ((raw: buffer, opts: SerdeGenericCompressionOptions?) -> buffer)
        & ((raw: string | buffer, opts: SerdeGenericCompressionOptions?) -> string | buffer),
    decompress:
        & ((compressed: string) -> string)
        & ((compressed: buffer) -> buffer)
        & ((compressed: string | buffer) -> string | buffer),
}
export type _zune_serde_lz4 = {
    compress:
        & ((raw: string) -> string)
        & ((raw: buffer) -> buffer)
        & ((raw: string | buffer) -> string | buffer),
    compressFrame:
        & ((raw: string, opts: SerdeGenericCompressionOptions?) -> string)
        & ((raw: buffer, opts: SerdeGenericCompressionOptions?) -> buffer)
        & ((raw: string | buffer, opts: SerdeGenericCompressionOptions?) -> string | buffer),
    decompress:
        & ((compressed: string, size: number) -> string)
        & ((compressed: buffer, size: number) -> buffer)
        & ((compressed: string | buffer, size: number) -> string | buffer),
    decompressFrame:
        & ((compressed: string) -> string)
        & ((compressed: buffer) -> buffer)
        & ((compressed: string | buffer) -> string | buffer),
}
export type _zune_serde = {
    json: _zune_serde_json,
    json5: _zune_serde_json5,
    toml: _zune_serde_toml,
    yaml: _zune_serde_yaml,
    base64: _zune_serde_base64,
    gzip: _zune_serde_gzip,
    flate: _zune_serde_flate,
    zlib: _zune_serde_zlib,
    brotli: _zune_serde_brotli,
    zstd: _zune_serde_zstd,
    lz4: _zune_serde_lz4,
}
--[[ fs ]]
export type MetadataKind =
    | "file"
    | "directory"
    | "sym_link"
    | "door"
    | "character_device"
    | "unix_domain_socket"
    | "block_device"
    | "event_port"
    | "named_pipe"
    | "whiteout"
    | "unknown"
export type Metadata = {
    kind: MetadataKind,
    symlink: boolean,
    created_at: number,
    modified_at: number,
    accessed_at: number,
    size: number,
    permissions: {
        read_only: boolean,
    },
}
export type FileStat = {
    kind: MetadataKind,
    changed_at: number,
    modified_at: number,
    accessed_at: number,
    size: number,
    mode: number,
} | {
    kind: "none",
}
declare class FileHandle
    read:
        & ((self: FileHandle, amount: number?) -> string)
        & ((self: FileHandle, amount: number?, bytes: false?) -> string)
        & ((self: FileHandle, amount: number?, bytes: true) -> buffer)
        & ((self: FileHandle, amount: number?, bytes: boolean?) -> string | buffer)
    readSync:
        & ((self: FileHandle, amount: number?) -> string)
        & ((self: FileHandle, amount: number?, bytes: false?) -> string)
        & ((self: FileHandle, amount: number?, bytes: true) -> buffer)
        & ((self: FileHandle, amount: number?, bytes: boolean?) -> string | buffer)
    write: (self: FileHandle, contents: string | buffer) -> ()
    writeSync: (self: FileHandle, contents: string | buffer) -> ()
    append: (self: FileHandle, contents: string | buffer) -> ()
    appendSync: (self: FileHandle, contents: string | buffer) -> ()
    getSize: (self: FileHandle) -> number
    getSeekPosition: (self: FileHandle) -> number
    seekFromEnd: (self: FileHandle, amount: number?) -> ()
    seekTo: (self: FileHandle, amount: number?) -> ()
    seekBy: (self: FileHandle, amount: number?) -> ()
    lock: (self: FileHandle, lockMode: ("shared" | "exclusive" | "none")?) -> boolean
    unlock: (self: FileHandle) -> ()
    sync: (self: FileHandle) -> ()
    readonly:
        & ((self: FileHandle) -> boolean)
        & ((self: FileHandle, enabled: boolean) -> ())
    close: (self: FileHandle) -> ()
end
declare class FileWatcher
    stop: (self: FileWatcher) -> ()
end
export type FileCreateOptions = {
    exclusive: boolean?,
    truncate: boolean?,
}
export type FileOpenOptions = {
    mode: string?,
}
type DirectoryEntry = {
    name: string,
    kind: MetadataKind,
}
export type _zune_fs_path = {
    join: (...string) -> string,
    relative: (from: string, to: string) -> string,
    resolve: (...string) -> string,
    dirname: (path: string) -> string?,
    basename: (path: string) -> string,
    stem: (path: string) -> string,
    extension: (path: string) -> string,
    isAbsolute: (path: string) -> boolean,
    globMatch: (path: string, pattern: string) -> boolean,
}
type WatchEvent = "created" | "modified" | "moved" | "renamed" | "deleted" | "metadata"
export type _zune_fs = {
    createFile: (path: string, opts: FileCreateOptions?) -> FileHandle,
    openFile: (path: string, opts: FileOpenOptions?) -> FileHandle,
    readFile:
        & ((path: string) -> string)
        & ((path: string, bytes: false?) -> string)
        & ((path: string, bytes: true) -> buffer)
        & ((path: string, bytes: boolean) -> string | buffer),
    readFileSync:
        & ((path: string) -> string)
        & ((path: string, bytes: false?) -> string)
        & ((path: string, bytes: true) -> buffer)
        & ((path: string, bytes: boolean) -> string | buffer),
    entries: (path: string) -> {DirectoryEntry},
    writeFile: (path: string, contents: string | buffer) -> (),
    writeFileSync: (path: string, contents: string | buffer) -> (),
    makeDir: (path: string, recursive: boolean?) -> (),
    deleteFile: (path: string) -> (),
    deleteDir: (path: string, recursive: boolean?) -> (),
    metadata: (path: string) -> Metadata,
    stat: (path: string) -> FileStat,
    move: (from: string, to: string, overwrite: boolean?) -> (),
    copy: (from: string, to: string, overwrite: boolean?) -> (),
    symlink: (from: string, to: string) -> (),
    getExePath: () -> string,
    realPath: (path: string) -> string,
    watch: (path: string, callback: (path: string, events: {WatchEvent}) -> ()) -> FileWatcher,
    embedFile: (path: string) -> buffer,
    embeddedFiles: () -> {string},
    embeddedScripts: () -> {string},
    path: _zune_fs_path,
}
--[[ crypto ]]
type Input = string | buffer
declare class CryptoHash
    digest:
        & ((self: CryptoHash) -> buffer)
        & ((self: CryptoHash, encoding: "binary") -> buffer)
        & ((self: CryptoHash, encoding: "hex" | "base64") -> string)
        & ((self: CryptoHash, encoding: string) -> string | buffer)
    update: (self: CryptoHash, value: string | buffer) -> ()
    copy: (self: CryptoHash) -> CryptoHash
end
declare class TlsCertBundle

end
declare class TlsCertKeyPair

end
export type CryptoHashAlgorithms =
    | "sha1"
    | "md5"
    | "blake3"
    | "sha224"
    | "sha256"
    | "sha384"
    | "sha512"
    | "sha3_224"
    | "sha3_256"
    | "sha3_384"
    | "sha3_512"
    | "blake2b128"
    | "blake2b160"
    | "blake2b256"
    | "blake2b384"
    | "blake2b512"
    | "blake2s128"
    | "blake2s160"
    | "blake2s224"
    | "blake2s256"
type BcryptPasswordOptions = {
    algorithm: "bcrypt"?,
    cost: number?,
}
type Argon2PasswordOptions = {
    algorithm: ("argon2d" | "argon2i" | "argon2id")?,
    time_cost: number?,
    memory_cost: number?,
    threads: number?,
}
export type CryptoPasswordOptions = BcryptPasswordOptions | Argon2PasswordOptions
type EncryptedData = {
    cipher: buffer,
    tag: buffer,
}
export type CryptoTlsClientConfig = {
    host: string,
    ca: TlsCertBundle,
}
export type _zune_crypto_password = {
    hash: (password: string | buffer, opts: CryptoPasswordOptions?) -> string,
    verify: (password: string | buffer, hash: string | buffer) -> boolean,
}
export type _zune_crypto_uuid = {
    v4: () -> string,
    v7: () -> string,
}
export type _zune_crypto_random = {
    nextNumber:
        & (() -> number)
        & ((min: number, max: number) -> number),
    nextInteger:
        & (() -> number)
        & ((min: number, max: number) -> number),
    nextBoolean: () -> boolean,
    fill: (buffer: buffer, offset: number, length: number) -> (),
}
export type _zune_crypto_aead = {
    aes_gcm: {
        Aes128Gcm: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        Aes256Gcm: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
    },
    aes_ocb: {
        Aes128Ocb: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        Aes256Ocb: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
    },
    aegis: {
        Aegis128X4: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        Aegis128X2: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        Aegis128L: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        Aegis256X4: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        Aegis256X2: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        Aegis256: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        Aegis128X4_256: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        Aegis128X2_256: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        Aegis128L_256: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        Aegis256X4_256: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        Aegis256X2_256: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        Aegis256_256: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
    },
    chacha_poly: {
        ChaCha8Poly1305: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        ChaCha12Poly1305: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        ChaCha20Poly1305: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        XChaCha8Poly1305: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        XChaCha12Poly1305: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
        XChaCha20Poly1305: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
    },
    salsa_poly: {
        XSalsa20Poly1305: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
    },
    isap: {
        IsapA128A: {
            encrypt: (data: Input, key: Input, nonce: Input, ad: Input?) -> EncryptedData,
            decrypt: (cipher: Input, tag: Input, key: Input, nonce: Input, ad: Input?) -> string,
        },
    },
}
export type _zune_crypto_tls = {
    bundleFromSystem: () -> TlsCertBundle,
    bundleFromFile: (file: string) -> TlsCertBundle,
    keyPairFromFile: (certFile: string, keyFile: string) -> TlsCertKeyPair,
    setupClient: (socket: NetworkSocket, config: CryptoTlsClientConfig) -> (),
    setupServer: (socket: NetworkSocket, config: CryptoTlsServerConfig) -> (),
}
export type CryptoTlsServerConfig = {
    auth: TlsCertKeyPair,
}
export type _zune_crypto = {
    createHash: (algorithm: CryptoHashAlgorithms, secret: string?) -> CryptoHash,
    password: _zune_crypto_password,
    uuid: _zune_crypto_uuid,
    random: _zune_crypto_random,
    aead: _zune_crypto_aead,
    tls: _zune_crypto_tls,
}
--[[ thread ]]
declare class Thread
    start: (self: Thread) -> ()
    join: (self: Thread) -> ()
    status: (self: Thread) -> "ready" | "running" | "dead"
    receive: (self: Thread) -> (...any)
    send: (self: Thread, ...any) -> ()
end
export type ThreadLoadOptions = {
    chunk_name: string?,
    native_code_gen: boolean?,
}
export type _zune_thread = {
    fromModule: (module: string) -> Thread,
    fromBytecode: (bytecode: string | buffer, opts: ThreadLoadOptions?) -> Thread,
    receive: () -> ...any,
    send: (...any) -> (),
    getCpuCount: () -> number,
    isThread: boolean,
}
--[[ time ]]
export type TimeDictionary = {
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    millisecond: number,
}
export type _zune_time_date = {
    now: () -> DateTime,
    fromIsoDate: (date: string) -> DateTime,
    fromUnixTimestamp: (timestamp: number) -> DateTime,
    fromUnixTimestampMillis: (timestamp: number) -> DateTime,
    fromLocalTime: (year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number) -> DateTime,
    fromUniversalTime: (year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number) -> DateTime,
    parse: (date: string) -> DateTime,
}
export type _zune_time_instant = {
    now: () -> buffer,
}
declare class DateTime
    timestamp: number
    timestamp_millis: number
    toLocalTime: (self: DateTime) -> TimeDictionary
    toUniversalTime: (self: DateTime) -> TimeDictionary
    toIsoDate: (self: DateTime) -> string
    formatLocalTime: (self: DateTime, format: string) -> string
    formatUniversalTime: (self: DateTime, format: string) -> string
end
export type _zune_time = {
    date: _zune_time_date,
    instant: _zune_time_instant,
    timestamp: () -> number,
    timestampMillis: () -> number,
}
--[[ process ]]
export type ProcessOptions = {
    cwd: string?,
    env: {
        [string]: string
    }?,
    shell: (boolean | string)?,
    stdin: ("inherit" | "pipe" | "ignore")?,
    stdout: ("inherit" | "pipe" | "ignore")?,
    stderr: ("inherit" | "pipe" | "ignore")?,
}
export type ProcessResult = {
    ok: boolean,
    code: number,
}
export type ProcessRunResult<T> = ProcessResult & {
    stdout: T,
    stderr: T,
}
export type _zune_process_env = {
    [string]: string
}
declare class ProcessChild
    pid: number
    stdin: FileHandle?
    stdout: FileHandle?
    stderr: FileHandle?
    wait: (self: ProcessChild) -> ProcessResult
    kill: (self: ProcessChild) -> ProcessResult
end
export type _zune_process = {
    args: {string},
    env: _zune_process_env,
    loadEnv: () -> {[string]: string},
    cwd: () -> string,
    pid: () -> number,
    create: (exec: string, args: {string}?, opts: ProcessOptions?) -> ProcessChild,
    run:
        & ((exec: string) -> ProcessRunResult<string>)
        & ((exec: string, args: {string}?) -> ProcessRunResult<string>)
        & ((exec: string, args: {string}?, opts: ProcessOptions?, bytes: false?) -> ProcessRunResult<string?>)
        & ((exec: string, args: {string}?, opts: ProcessOptions?, bytes: true) -> ProcessRunResult<buffer?>)
        & ((exec: string, args: {string}?, opts: ProcessOptions?, bytes: boolean?) -> ProcessRunResult<string | buffer?>),
    exit: (code: number) -> never,
    onSignal: (signal: "INT", callback: () -> ()) -> (),
}
--[[ regex ]]
export type RegexMatch = {
    string: string,
    index: number,
}
declare class Regex
    match: (self: Regex, input: string | buffer) -> {RegexMatch}?
    search: (self: Regex, input: string | buffer) -> {RegexMatch}?
    captures: (self: Regex, input: string | buffer, global: boolean?) -> {{RegexMatch}}
    split: (self: Regex, input: string | buffer, global: boolean?) -> {string}
    isMatch: (self: Regex, input: string | buffer) -> boolean
    format: (self: Regex, str: string, format: string) -> string
    replace: (self: Regex, str: string, replacement: string) -> string
    replaceAll: (self: Regex, str: string, replacement: string) -> string
end
export type _zune_regex = {
    create: (pattern: string | buffer, flags: string?) -> Regex,
}
--[[ random ]]
declare class Random
    nextNumber:
        & ((self: Random) -> number)
        & ((self: Random, min: number, max: number) -> number)
    nextInteger: (self: Random, min: number, max: number) -> number
    nextBoolean: (self: Random) -> boolean
    clone: (self: Random) -> Random
end
type RandomNewFn = (seed: number?) -> Random
export type _zune_random_LuauPcg32 = {
    new: (seed: number?) -> Random,
}
export type _zune_random_Isaac64 = {
    new: (seed: number?) -> Random,
}
export type _zune_random_Pcg32 = {
    new: (seed: number?) -> Random,
}
export type _zune_random_Xoroshiro128 = {
    new: (seed: number?) -> Random,
}
export type _zune_random_Xoshiro256 = {
    new: (seed: number?) -> Random,
}
export type _zune_random_Sfc64 = {
    new: (seed: number?) -> Random,
}
export type _zune_random_RomuTrio = {
    new: (seed: number?) -> Random,
}
export type _zune_random = {
    new: (seed: number?) -> Random,
    LuauPcg32: _zune_random_LuauPcg32,
    Isaac64: _zune_random_Isaac64,
    Pcg32: _zune_random_Pcg32,
    Xoroshiro128: _zune_random_Xoroshiro128,
    Xoshiro256: _zune_random_Xoshiro256,
    Sfc64: _zune_random_Sfc64,
    RomuTrio: _zune_random_RomuTrio,
}
--[[ testing ]]
type BasicCases = {
    toBe: (expected: any) -> (),
    toBeDefined: () -> (),
    toBeCloseTo: (expected: number, precision: number) -> (),
    toBeGreaterThan: (expected: number) -> (),
    toBeGreaterThanOrEqual: (expected: number) -> (),
    toBeLessThan: (expected: number) -> (),
    toBeLessThanOrEqual: (expected: number) -> (),
    toBeNil: () -> (),
    toBeNan: () -> (),
    toHaveLength: (expected: number) -> (),
    toBeFalsy: () -> (),
    toBeTruthy: () -> (),
}
type ExpectCases = BasicCases & {
    never: BasicCases,
}
type FunctionalCases = ExpectCases & {
    toThrow: (expected: string?) -> (),
    never: FunctionalCases,
}
type ExpectHandler = {
    any: (type: string) -> any,
    type: (type: "nil" | "boolean" | "number" | "string" | "function" | "table" | "userdata" | "thread" | "buffer" | "vector") -> any,
    similar: (expected: any) -> any,
}
export type _zune_testing = {
    running: boolean,
    _failed: number,
    _count: number,
    _start: number,
    test: (name: string, callback: () -> (), timeout: number?) -> (),
    describe: (name: string, callback: () -> ()) -> (),
    defer: (fn: () -> ()) -> (),
    expect: ((value: (...any) -> ...any) -> FunctionalCases) & ((value: any) -> ExpectCases) & ExpectHandler,
    expected: (value: any) -> (),
    expectEqual: ((expected: any, value: any) -> ()),
}
--[[ luau ]]
export type LuauCompileOptions = {
    debug_level: number?,
    optimization_level: number?,
    coverage_level: number?,
}
export type LuauLoadOptions = {
    env: {
        [any]: any
    }?,
    chunk_name: string?,
    native_code_gen: boolean?,
}
export type LuauCoverageData = {
    name: string,
    line: number,
    depth: number,
    [number]: number,
}
type Position = {
    line: number,
    column: number,
}
export type Location = {
    begin: Position,
    ["end"]: Position,
}
export type ParseResult = {
    errors: {{
        message: string,
        location: Location,
    }}?,
    root: {any},
    eof: {
        text: "",
        position: Position,
        tag: "eof"
    },
    lines: number,
    lineOffsets: {number},
    hotcomments: {{
        header: boolean,
        content: string,
        location: Location,
    }},
}
export type _zune_luau = {
    compile: (source: string | buffer, opts: LuauCompileOptions?) -> buffer,
    load: (bytecode: string | buffer, opts: LuauLoadOptions?) -> ((...any) -> ...any),
    coverage: (fn: (...any) -> ...any) -> {LuauCoverageData},
    parse: (src: string | buffer) -> ParseResult,
    parseExpr: (src: string | buffer) -> any,
    garbagecollect: () -> (),
}
--[[ platform ]]
export type PlatformCPUArchitecture =
    | "aarch64"
    | "x86_64"
    | "riscv64"
    | "powerpc64le"
export type PlatformOS =
    | "linux"
    | "windows"
    | "macos"
    | "freebsd"
export type _zune_platform_cpu = {
    arch: PlatformCPUArchitecture,
    endian: "big" | "little",
}
export type PlatformABI =
    | "none"
    | "gnu"
    | "gnuabin32"
    | "gnuabi64"
    | "gnueabi"
    | "gnueabihf"
    | "gnuf32"
    | "gnusf"
    | "gnux32"
    | "code16"
    | "eabi"
    | "eabihf"
    | "ilp32"
    | "android"
    | "androideabi"
    | "musl"
    | "muslabin32"
    | "muslabi64"
    | "musleabi"
    | "musleabihf"
    | "muslf32"
    | "muslsf"
    | "muslx32"
    | "msvc"
    | "itanium"
    | "cygnus"
    | "simulator"
    | "macabi"
    | "ohos"
    | "ohoseabi"
export type _zune_platform = {
    os: PlatformOS,
    abi: PlatformABI,
    cpu: _zune_platform_cpu,
    async: "io_uring" | "epoll" | "kqueue" | "iocp",
    getFreeMemory: () -> number,
    getTotalMemory: () -> number,
    getPageSize: () -> number,
    getKernelVersion: () -> string,
    getHostName: () -> string,
}
--[[ net ]]
declare class NetworkSocket
    send: (self: NetworkSocket, data: string | buffer, offset: number?) -> number
    sendMsg: (self: NetworkSocket, port: number, address: string, data: string | buffer, offset: number?) -> number
    recv: (self: NetworkSocket, max_size: number?) -> buffer
    recvMsg: (self: NetworkSocket, max_size: number?) -> (NetworkAddress, buffer)
    accept: (self: NetworkSocket) -> NetworkSocket
    connect: (self: NetworkSocket, address: string, port: number) -> ()
    listen: (self: NetworkSocket, backlog: number?) -> ()
    bindIp: (self: NetworkSocket, address: string, port: number) -> ()
    getName: (self: NetworkSocket) -> NetworkAddress
    setOption: (self: NetworkSocket, level: number, optname: number, value: boolean | string | buffer) -> ()
    close: (self: NetworkSocket) -> ()
    isOpen: (self: NetworkSocket) -> boolean
end
declare class HttpServer
    stop: (self: HttpServer) -> ()
    getPort: (self: HttpServer) -> number
    isRunning: (self: HttpServer) -> boolean
end
declare class HttpWebSocket
    send: (self: HttpWebSocket, message: string | buffer) -> ()
    close: (self: HttpWebSocket, code: number?) -> ()
    isConnected: (self: HttpWebSocket) -> boolean
end
export type NetworkAddress = {
    family: number,
    port: number,
    address: string,
}
export type HttpServerRequest = {
    method: string,
    path: string,
    raw_path: string,
    query: {
        [string | number]: string
    },
    headers: {
        [string]: string
    },
    body: string?,
}
export type HttpServerResponse = {
    status_code: number,
    headers: {
        [string]: string
    }?,
    body: (string | buffer)?,
}
export type ServerWebSocketHandlers = {
    upgrade: ((request: HttpServerRequest) -> boolean)?,
    open: ((websocket: HttpWebSocket) -> ())?,
    message: ((websocket: HttpWebSocket, message: string) -> ())?,
    close: ((websocket: HttpWebSocket, code: number) -> ())?,
}
export type HttpServeOptions = {
    port: number,
    address: string?,
    reuse_address: boolean?,
    backlog: number?,
    max_body_size: number?,
    max_header_size: number?,
    max_headers: number?,
    client_timeout: number?,
    max_connections: number?,
    request: (request: HttpServerRequest) -> string | buffer | HttpServerResponse,
    websocket: ServerWebSocketHandlers?,
    tls: {
        auth: TlsCertKeyPair?,
    }?,
}
export type HttpResponse<T> = {
    ok: boolean,
    status_code: number,
    status_reason: string,
    headers: {
        [string]: string
    },
    body: T,
}
export type HttpRequestOptions = {
    headers: {
        [string]: string
    }?,
    method: ("GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH")?,
    body: (string | buffer)?,
    allow_redirects: boolean?,
    timeout: number?,
    max_body_size: number?,
    max_header_size: number?,
    max_headers: number?,
    tls: {
        host: string?,
        ca: TlsCertBundle?,
    }?,
}
export type HttpWebSocketOptions = {
    headers: {
        [string]: string
    }?,
    protocols: {string}?,
    timeout: number?,
    accept: ((socket: HttpWebSocket, request: HttpServerResponse) -> boolean)?,
    open: ((socket: HttpWebSocket) -> ())?,
    close: ((socket: HttpWebSocket, close: number?) -> ())?,
    message: ((socket: HttpWebSocket, message: string) -> ())?,
    tls: {
        host: string?,
        ca: TlsCertBundle?,
    }?,
}
export type _zune_net_ADDRF = {
    RDS: number,
    ROSE: number,
    BRIDGE: number,
    PHONET: number,
    SNA: number,
    FILE: number,
    MPLS: number,
    ROUTE: number,
    WANPIPE: number,
    UNSPEC: number,
    CAIF: number,
    NETROM: number,
    UNIX: number,
    INET: number,
    ATMSVC: number,
    MAX: number,
    NETLINK: number,
    IUCV: number,
    SMC: number,
    INET6: number,
    TIPC: number,
    KEY: number,
    QIPCRTR: number,
    VSOCK: number,
    IPX: number,
    ASH: number,
    IB: number,
    PACKET: number,
    KCM: number,
    DECnet: number,
    RXRPC: number,
    NETBEUI: number,
    NFC: number,
    ALG: number,
    IEEE802154: number,
    ISDN: number,
    XDP: number,
    LOCAL: number,
    BLUETOOTH: number,
    CAN: number,
    LLC: number,
    APPLETALK: number,
    PPPOX: number,
    ATMPVC: number,
    AX25: number,
    ECONET: number,
    IRDA: number,
    SECURITY: number,
    X25: number,
}
export type _zune_net_SOCKF = {
    DCCP: number,
    RAW: number,
    RDM: number,
    DGRAM: number,
    PACKET: number,
    STREAM: number,
    SEQPACKET: number,
    CLOEXEC: number,
    NONBLOCK: number,
}
export type _zune_net_SOCKOPT = {
    ATTACH_FILTER: number,
    CNX_ADVICE: number,
    PEERCRED: number,
    LINGER: number,
    DEBUG: number,
    RXQ_OVFL: number,
    SNDBUF: number,
    DONTROUTE: number,
    ZEROCOPY: number,
    PASSCRED: number,
    DETACH_REUSEPORT_BPF: number,
    ATTACH_REUSEPORT_EBPF: number,
    MEMINFO: number,
    COOKIE: number,
    SNDBUFFORCE: number,
    PRIORITY: number,
    BSDCOMPAT: number,
    SNDTIMEO: number,
    BINDTODEVICE: number,
    OOBINLINE: number,
    BPF_EXTENSIONS: number,
    TIMESTAMP_NEW: number,
    NO_CHECK: number,
    WIFI_STATUS: number,
    PEERGROUPS: number,
    TYPE: number,
    NOFCS: number,
    DOMAIN: number,
    TIMESTAMPNS_NEW: number,
    SNDLOWAT: number,
    KEEPALIVE: number,
    PEEK_OFF: number,
    PEERSEC: number,
    PEERNAME: number,
    RCVBUF: number,
    REUSEPORT: number?,
    INCOMING_NAPI_ID: number,
    TIMESTAMPING_OLD: number,
    RCVBUFFORCE: number,
    REUSEADDR: number,
    MAX_PACING_RATE: number,
    MARK: number,
    RCVTIMEO_NEW: number,
    BUSY_POLL: number,
    TIMESTAMPING_NEW: number,
    BINDTOIFINDEX: number,
    TXTIME: number,
    SECURITY_ENCRYPTION_NETWORK: number,
    LOCK_FILTER: number,
    RCVLOWAT: number,
    SECURITY_ENCRYPTION_TRANSPORT: number,
    ATTACH_BPF: number,
    INCOMING_CPU: number,
    ERROR: number,
    SELECT_ERR_QUEUE: number,
    DETACH_BPF: number,
    SNDTIMEO_NEW: number,
    TIMESTAMPNS_OLD: number,
    PASSSEC: number,
    TIMESTAMP_OLD: number,
    GET_FILTER: number,
    DETACH_FILTER: number,
    ATTACH_REUSEPORT_CBPF: number,
    BROADCAST: number,
    SECURITY_AUTHENTICATION: number,
    PROTOCOL: number,
    ACCEPTCONN: number,
    RCVTIMEO: number,
}
export type _zune_net_SOCKOPTLV = {
    PPPOL2TP: number,
    RDS: number,
    TIPC: number,
    ALG: number,
    PNPIPE: number,
    BLUETOOTH: number,
    PACKET: number,
    IPV6: number,
    KCM: number,
    RXRPC: number,
    NETBEUI: number,
    DECNET: number,
    TLS: number,
    ICMPV6: number,
    RAW: number,
    XDP: number,
    SOCKET: number,
    LLC: number,
    NFC: number,
    CAIF: number,
    IUCV: number,
    X25: number,
    AAL: number,
    NETLINK: number,
    DCCP: number,
    IRDA: number,
    ATM: number,
    IP: number,
}
export type _zune_net_IPPROTO = {
    COMP: number,
    ICMP: number,
    ESP: number,
    IGMP: number,
    TCP: number,
    ICMPV6: number,
    MTP: number,
    GRE: number,
    SCTP: number,
    MAX: number,
    NONE: number,
    FRAGMENT: number,
    IDP: number,
    UDPLITE: number,
    HOPOPTS: number,
    MH: number,
    BEETPH: number,
    AH: number,
    IPIP: number,
    IPV6: number,
    PIM: number,
    DSTOPTS: number,
    UDP: number,
    DCCP: number,
    RAW: number,
    PUP: number,
    MPLS: number,
    ENCAP: number,
    RSVP: number,
    ROUTING: number,
    EGP: number,
    TP: number,
    IP: number,
}
export type _zune_net_http = {
    serve: (opts: HttpServeOptions) -> HttpServer,
    request:
        & ((host: string) -> HttpResponse<string>)
        & ((host: string, opts: HttpRequestOptions?, bytes: false?) -> HttpResponse<string>)
        & ((host: string, opts: HttpRequestOptions?, bytes: true) -> HttpResponse<buffer>)
        & ((host: string, opts: HttpRequestOptions?, bytes: boolean?) -> HttpResponse<string | buffer>),
    websocket: (host: string, opts: HttpWebSocketOptions) -> HttpWebSocket,
}
export type _zune_net = {
    ADDRF: _zune_net_ADDRF,
    SOCKF: _zune_net_SOCKF,
    SOCKOPT: _zune_net_SOCKOPT,
    SOCKOPTLV: _zune_net_SOCKOPTLV,
    IPPROTO: _zune_net_IPPROTO,
    createSocket: (address_family: number, flags: number, protocol: number) -> NetworkSocket,
    getAddressList: (name: string, port: number) -> {NetworkAddress},
    http: _zune_net_http
}
--[[ ffi ]]
export type FFILibrary = {
    getSymbol: (self: FFILibrary, symbol: string) -> FFIPointer?,
    [string]: (...any) -> any,
}
declare class FFICompiled
    getSymbol: (self: FFICompiled, symbol: string) -> FFIPointer?
    listSymbols: (self: FFICompiled) -> {string}
end
declare class FFIDataType
    size: (self: FFIDataType) -> number
    alignment: (self: FFIDataType) -> number
    array: (self: FFIDataType, count: number) -> FFIArrayType
end
declare class FFIVectorType extends FFIDataType
    offset: (self: FFIVectorType, index: number) -> number
end
declare class FFIStructureType extends FFIDataType
    offset: (self: FFIStructureType, field: string) -> number
    new: (self: FFIStructureType, fields: {[string]: buffer | number | FFIPointer | vector}) -> buffer
end
declare class FFIArrayType extends FFIVectorType
    new: (self: FFIArrayType, values: {[number]: buffer | number | FFIPointer | vector}) -> buffer
end
declare class FFIPointerType extends FFIDataType
    tag: (self: FFIPointerType) -> number
    newTag: (self: FFIPointerType, tag: string | buffer) -> FFIPointerType
end
export type FFIAnyDataType = FFIDataType | FFIStructureType | FFIArrayType | FFIPointerType
export type FFIFunctionDefintion = {
    returns: FFIAnyDataType,
    args: {FFIAnyDataType}
}
declare class FFIPointer
    release: (self: FFIPointer) -> FFIPointer
    retain: (self: FFIPointer) -> FFIPointer
    tag:
        & ((self: FFIPointer) -> number)
        & ((self: FFIPointer, tag: number) -> FFIPointer)
    drop: (self: FFIPointer) -> FFIPointer
    offset: (self: FFIPointer, offset: number) -> FFIPointer
    read: (self: FFIPointer, srcOffset: number, dest: buffer | FFIPointer, destOffset: number, count: number) -> buffer
    write: (self: FFIPointer, destOffset: number, src: buffer | FFIPointer, srcOffset: number, count: number) -> ()
    readi8: (self: FFIPointer, offset: number?) -> number
    readi16: (self: FFIPointer, offset: number?) -> number
    readi32: (self: FFIPointer, offset: number?) -> number
    readi64: (self: FFIPointer, offset: number?) -> buffer
    readu8: (self: FFIPointer, offset: number?) -> number
    readu16: (self: FFIPointer, offset: number?) -> number
    readu32: (self: FFIPointer, offset: number?) -> number
    readu64: (self: FFIPointer, offset: number?) -> buffer
    readf32: (self: FFIPointer, offset: number?) -> number
    readf64: (self: FFIPointer, offset: number?) -> number
    readptr: (self: FFIPointer, offset: number?) -> FFIPointer
    writei8: (self: FFIPointer, offset: number, value: number | buffer | boolean) -> ()
    writei16: (self: FFIPointer, offset: number, value: number | buffer | boolean) -> ()
    writei32: (self: FFIPointer, offset: number, value: number | buffer | boolean) -> ()
    writei64: (self: FFIPointer, offset: number, value: number | buffer | boolean) -> ()
    writeu8: (self: FFIPointer, offset: number, value: number | buffer | boolean) -> ()
    writeu16: (self: FFIPointer, offset: number, value: number | buffer | boolean) -> ()
    writeu32: (self: FFIPointer, offset: number, value: number | buffer | boolean) -> ()
    writeu64: (self: FFIPointer, offset: number, value: number | buffer | boolean) -> ()
    writef32: (self: FFIPointer, offset: number, value: number | buffer | boolean) -> ()
    writef64: (self: FFIPointer, offset: number, value: number | buffer | boolean) -> ()
    writeptr: (self: FFIPointer, offset: number, value: FFIPointer) -> ()
    size:
        & ((self: FFIPointer) -> number?)
        & ((self: FFIPointer, size: number) -> ())
    alignment:
        & ((self: FFIPointer) -> number?)
        & ((self: FFIPointer, alignment: number) -> ())
    span: (self: FFIPointer, offset: number?) -> buffer
end
export type _zune_ffi_types = {
    void: FFIDataType,
    i8: FFIDataType,
    u8: FFIDataType,
    i16: FFIDataType,
    u16: FFIDataType,
    i32: FFIDataType,
    u32: FFIDataType,
    i64: FFIDataType,
    u64: FFIDataType,
    float: FFIDataType,
    double: FFIDataType,
    pointer: FFIPointerType,
    vector2_32: FFIVectorType,
    vector3_32: FFIVectorType,
}
export type _zune_ffi_c = {
    compile: (src: string, opts: FFICompileOptions?) -> FFICompiled,
}
export type FFICompileOptions = {
    options: string?,
    files: {string}?,
    libraries: {string}?,
    library_paths: {string}?,
    includes: {string}?,
    sysincludes: {string}?,
    symbols: {
        [string]: FFIPointer
    }?,
}
export type _zune_ffi = {
    prefix: string,
    suffix: string,
    types: _zune_ffi_types,
    c: _zune_ffi_c,
    null: FFIPointer,
    ptr: (src: FFIPointer) -> FFIPointer,
    ptrFromAddress: (src: buffer) -> FFIPointer,
    getLuaState: (mainthread: boolean?) -> FFIPointer,
    alloc: (size: number, alignment: number?) -> FFIPointer,
    create: (type: FFIAnyDataType) -> FFIPointer,
    free: (src: FFIPointer) -> (),
    dupe: (src: buffer | FFIPointer | vector) -> FFIPointer,
    tagName: (tag: number) -> string?,
    struct: (fields: {{[string]: FFIAnyDataType}}) -> FFIStructureType,
    fn: (definition: FFIFunctionDefintion, srcPtr: FFIPointer) -> ((...any) -> any),
    closure: (definition: FFIFunctionDefintion, handler: (...any) -> any) -> FFIPointer,
    dlopen: (path: string, functions: {[string]: FFIFunctionDefintion}) -> FFILibrary,
}
--[[ io ]]
declare class IoReadable
    read:
        & ((self: IoReadable, amount: number?) -> buffer)
        & ((self: IoReadable, amount: number?, bytes: true?) -> buffer)
        & ((self: IoReadable, amount: number?, bytes: false) -> string)
        & ((self: IoReadable, amount: number?, bytes: boolean?) -> string | buffer)
    readu8: (self: IoReadable) -> number
    readu16: (self: IoReadable) -> number
    readu32: (self: IoReadable) -> number
    readi8: (self: IoReadable) -> number
    readi16: (self: IoReadable) -> number
    readi32: (self: IoReadable) -> number
    readf32: (self: IoReadable) -> number
    readf64: (self: IoReadable) -> number
end
declare class IoWritable
    write: (self: IoWritable, data: string | buffer) -> ()
    writeu8: (self: IoWritable, value: number) -> ()
    writeu16: (self: IoWritable, value: number) -> ()
    writeu32: (self: IoWritable, value: number) -> ()
    writei8: (self: IoWritable, value: number) -> ()
    writei16: (self: IoWritable, value: number) -> ()
    writei32: (self: IoWritable, value: number) -> ()
    writef32: (self: IoWritable, value: number) -> ()
    writef64: (self: IoWritable, value: number) -> ()
end
declare class BufferStream
    read:
        & ((self: BufferStream, amount: number?) -> buffer)
        & ((self: BufferStream, amount: number?, bytes: true?) -> buffer)
        & ((self: BufferStream, amount: number?, bytes: false) -> string)
        & ((self: BufferStream, amount: number?, bytes: boolean?) -> string | buffer)
    write: (self: BufferStream, data: string | buffer) -> ()
    pos: (self: BufferStream) -> number
    size: (self: BufferStream) -> number
    seekTo: (self: BufferStream, pos: number) -> ()
    seekBy: (self: BufferStream, offset: number) -> ()
    canRead: (self: BufferStream, amount: number?) -> boolean
    writer: (self: BufferStream) -> IoWritable
    reader: (self: BufferStream) -> IoReadable
end
declare class BufferSink
    len: number
    closed: boolean
    flush:
        & ((self: BufferSink) -> buffer)
        & ((self: BufferSink, bytes: true?) -> buffer)
        & ((self: BufferSink, bytes: false) -> string)
        & ((self: BufferSink, bytes: boolean?) -> string | buffer)
    write: (self: BufferSink, data: string | buffer) -> ()
    writer: (self: BufferSink) -> IoWritable
    close: (self: BufferSink) -> ()
end
export type _zune_io_terminal = {
    isTTY: boolean,
    getCurrentMode: () -> "normal" | "raw",
    enableRawMode: () -> boolean,
    restoreMode: () -> boolean,
    getSize: () -> (number?, number?),
}
export type BufferSinkOptions = {
    limit: number?,
    size: number?,
}
export type _zune_io = {
    format: (...any) -> string,
    createBufferSink: (opts: BufferSinkOptions?) -> BufferSink,
    createFixedBufferStream: (buffer: buffer) -> BufferStream,
    terminal: _zune_io_terminal,
    stdout: FileHandle,
    stderr: FileHandle,
    stdin: FileHandle,
}
--[[ require ]]
export type _zune_require = {
    navigate: (path: string | buffer, from: (string | buffer)?, config: string | buffer?) -> string,
    getCached: (resolvedPath: string) -> any?,
}
--[[ mem ]]
export type MemWritableSlice = buffer | FFIPointer
export type MemReadableSlice = string | buffer | FFIPointer
export type _zune_mem = {
    MAX_SIZE: number,
    len: (src: MemReadableSlice) -> number?,
    copy: (dest: MemWritableSlice, destOffset: number, src: MemReadableSlice, srcOffset: number, count: number?) -> (),
    slice: (src: MemReadableSlice, offset: number, count: number?) -> buffer,
    eqlSlice: (a: MemReadableSlice, aOffset: number, b: MemReadableSlice, bOffset: number, count: number?) -> boolean,
    eql: (a: MemReadableSlice, b: MemReadableSlice) -> boolean,
    startsWith: (slice: MemReadableSlice, needle: MemReadableSlice) -> boolean,
    endsWith: (slice: MemReadableSlice, needle: MemReadableSlice) -> boolean,
    trim: (src: MemReadableSlice, values_to_strip: MemReadableSlice) -> buffer,
    trimLeft: (src: MemReadableSlice, values_to_strip: MemReadableSlice) -> buffer,
    trimRight: (src: MemReadableSlice, values_to_strip: MemReadableSlice) -> buffer,
    find: (src: MemReadableSlice, needle: MemReadableSlice) -> number?,
    findPos: (src: MemReadableSlice, offset: number, needle: MemReadableSlice) -> number?,
    findLast: (src: MemReadableSlice, needle: MemReadableSlice) -> number?,
    findScalar: (src: MemReadableSlice, char: number) -> number?,
    findScalarPos: (src: MemReadableSlice, offset: number, char: number) -> number?,
    findScalarLast: (src: MemReadableSlice, char: number) -> number?,
    findAny: (src: MemReadableSlice, needle: MemReadableSlice) -> number?,
    findAnyPos: (src: MemReadableSlice, offset: number, needle: MemReadableSlice) -> number?,
    findAnyLast: (src: MemReadableSlice, needle: MemReadableSlice) -> number?,
    findNone: (src: MemReadableSlice, needle: MemReadableSlice) -> number?,
    findNonePos: (src: MemReadableSlice, offset: number, needle: MemReadableSlice) -> number?,
    findNoneLast: (src: MemReadableSlice, needle: MemReadableSlice) -> number?,
    findDiff: (src: MemReadableSlice, needle: MemReadableSlice) -> number?,
    findDiffPos: (src: MemReadableSlice, offset: number, needle: MemReadableSlice) -> number?,
    findMax: (src: MemReadableSlice, offset: number?, count: number?) -> number,
    findMin: (src: MemReadableSlice, offset: number?, count: number?) -> number,
    findMinMax: (src: MemReadableSlice, offset: number?, count: number?) -> (number, number),
    cutPrefix: (src: MemReadableSlice, prefix: MemReadableSlice) -> buffer?,
    cutSuffix: (src: MemReadableSlice, suffix: MemReadableSlice) -> buffer?,
    cut: (src: MemReadableSlice, needle: MemReadableSlice) -> (buffer?, buffer?),
    cutLast: (src: MemReadableSlice, needle: MemReadableSlice) -> (buffer?, buffer?),
    cutScalar: (src: MemReadableSlice, char: number) -> (buffer?, buffer?),
    cutScalarLast: (src: MemReadableSlice, char: number) -> (buffer?, buffer?),
    replaceScalar: (src: MemWritableSlice, char: number, replacement: number, offset: number?, count: number?) -> (),
    max: (src: MemReadableSlice, offset: number?, count: number?) -> number,
    min: (src: MemReadableSlice, offset: number?, count: number?) -> number,
    reverse: (src: MemWritableSlice, offset: number?, count: number?) -> (),
    rotate: (src: MemWritableSlice, amount: number, offset: number?, count: number?) -> (),
    set: (dest: MemWritableSlice, value: number, offset: number?, count: number?) -> (),
    toVector2: (src: MemReadableSlice, offset: number?) -> vector,
    toVector3: (src: MemReadableSlice, offset: number?) -> vector,
    writeVector2: (dest: MemWritableSlice, offset: number?, vec: vector) -> (),
    writeVector3: (dest: MemWritableSlice, offset: number?, vec: vector) -> (),
}
--[[ sqlite ]]
export type SQLite3Values = {
    [string]: number | string | buffer
}
export type SQLite3Result = {
    last_insert_row_id: number,
    changes: number,
}
declare class SQLite3Statement
    run: (self: SQLite3Statement, args: SQLite3Values?) -> SQLite3Result
    get: (self: SQLite3Statement, args: SQLite3Values?) -> SQLite3Values?
    all: (self: SQLite3Statement, args: SQLite3Values?) -> {SQLite3Values}
    finalize: (self: SQLite3Statement) -> ()
end
type TransactionKind = "deferred" | "immediate" | "exclusive"
type TransactionFn = <A...,  R...>(self: SQLite3Database, callback: ((A...) ->  R...), kind: TransactionKind?) -> ((A...) ->  R...)
declare class SQLite3Database
    transaction: TransactionFn
    query: (self: SQLite3Database, query: string | buffer) -> SQLite3Statement
    exec: (self: SQLite3Database, query: string | buffer, args: SQLite3Values?) -> SQLite3Result
    close: (self: SQLite3Database) -> ()
end
export type _zune_sqlite = {
    open: (path: string?) -> SQLite3Database,
}
--[[ task ]]
export type _zune_task = {
    cancel: (thread: thread) -> (),
    defer: <A...,  R...>(f: ((A...) ->  R...) | thread,  A...) -> thread,
    delay: <A...,  R...>(sec: number, f: ((A...) -> (R...)) | thread,  A...) -> thread,
    spawn: <A...,  R...>(f: ((A...) -> (R...)) | thread,  A...) -> thread,
    wait: (sec: number?) -> number,
    count: (() -> number) & ((kinds: string) -> ...number),
}
declare _FILE: {
    main: boolean,
}
declare zune: {
    compiled: {
        optimize: number,
        debug: number,
        mode: "debug" | "release",
    }?,
    fs: _zune_fs,
    process: _zune_process,
    testing: _zune_testing,
    task: _zune_task,
    net: _zune_net,
    luau: _zune_luau,
    serde: _zune_serde,
    io: _zune_io,
    crypto: _zune_crypto,
    regex: _zune_regex,
    time: _zune_time,
    ffi: _zune_ffi,
    sqlite: _zune_sqlite,
    require: _zune_require,
    random: _zune_random,
    thread: _zune_thread,
    mem: _zune_mem,
    platform: _zune_platform,
}
