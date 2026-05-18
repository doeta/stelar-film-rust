#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, String, Vec};

// 1. Definisi Struktur Data (Model)
#[contracttype]
#[derive(Clone, Debug)]
pub struct Movie {
    pub id: u64,
    pub title: String,
    pub release_year: u32,
    pub description: String,
    pub poster_url: String,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Comment {
    pub id: u64,
    pub movie_id: u64,
    pub content: String,
    pub rating: u32,
}

// 2. Definisi Kunci Penyimpanan (Storage Keys)
#[contracttype]
pub enum DataKey {
    Movie(u64),          // Kunci untuk menyimpan entitas film berdasarkan ID
    Comments(u64),       // Kunci untuk menyimpan Vec<Comment> berdasarkan ID Film
    MovieCounter,        // Penghitung untuk auto-increment ID film
    CommentCounter,      // Penghitung untuk auto-increment ID komentar
}

#[contract]
pub struct MovieContract;

#[contractimpl]
impl MovieContract {
    // Helper function untuk mendapatkan ID film selanjutnya
    fn get_next_movie_id(env: &Env) -> u64 {
        let mut count: u64 = env.storage().instance().get(&DataKey::MovieCounter).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&DataKey::MovieCounter, &count);
        count
    }

    // CREATE: Menambahkan film baru
    pub fn create_movie(env: Env, title: String, release_year: u32, description: String, poster_url: String) -> u64 {
        let id = Self::get_next_movie_id(&env);
        
        let movie = Movie {
            id,
            title,
            release_year,
            description,
            poster_url,
        };

        // Menyimpan data film ke storage persisten
        env.storage().persistent().set(&DataKey::Movie(id), &movie);
        
        id
    }

    // READ: Mendapatkan data film berdasarkan ID
    pub fn get_movie(env: Env, id: u64) -> Movie {
        env.storage().persistent().get(&DataKey::Movie(id)).expect("Film tidak ditemukan")
    }

    // CREATE: Menambahkan komentar ke film tertentu
    pub fn add_comment(env: Env, movie_id: u64, content: String, rating: u32) -> u64 {
        // Validasi: Pastikan film ada
        assert!(env.storage().persistent().has(&DataKey::Movie(movie_id)), "Film tidak ditemukan");

        // Dapatkan ID komentar baru (logika counter disederhanakan menggunakan timestamp/prng untuk efisiensi)
        let comment_id = env.prng().gen::<u64>();

        let comment = Comment {
            id: comment_id,
            movie_id,
            content,
            rating,
        };

        // Ambil daftar komentar yang sudah ada untuk film ini, atau buat Vector baru
        let mut comments: Vec<Comment> = env.storage()
            .persistent()
            .get(&DataKey::Comments(movie_id))
            .unwrap_or(Vec::new(&env));

        comments.push_back(comment);

        // Simpan kembali daftar komentar yang sudah diperbarui
        env.storage().persistent().set(&DataKey::Comments(movie_id), &comments);

        comment_id
    }

    // READ: Mendapatkan daftar komentar untuk sebuah film
    pub fn get_comments(env: Env, movie_id: u64) -> Vec<Comment> {
        env.storage()
            .persistent()
            .get(&DataKey::Comments(movie_id))
            .unwrap_or(Vec::new(&env))
    }
}