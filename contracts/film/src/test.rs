#![cfg(test)]

use super::*;
use soroban_sdk::{Env, String};

#[test]
fn test_movie_crud() {
    // 1. Inisialisasi environment simulasi
    let env = Env::default();
    
    // 2. Daftarkan kontrak ke environment lokal
    let contract_id = env.register_contract(None, MovieContract);
    let client = MovieContractClient::new(&env, &contract_id);

    // 3. Test Create Movie
    let title = String::from_str(&env, "Inception");
    let description = String::from_str(&env, "Mimpi di dalam mimpi");
    let poster_url = String::from_str(&env, "https://example.com/inception.jpg");
    let release_year = 2010;

    // Memanggil fungsi dari lib.rs
    let movie_id = client.create_movie(&title, &release_year, &description, &poster_url);
    
    // Memastikan ID pertama yang terbuat adalah 1
    assert_eq!(movie_id, 1);

    // 4. Test Get Movie
    let movie = client.get_movie(&movie_id);
    
    // Memastikan data yang disimpan sesuai dengan yang dipanggil
    assert_eq!(movie.title, title);
    assert_eq!(movie.release_year, 2010);
    assert_eq!(movie.description, description);
    assert_eq!(movie.poster_url, poster_url);
}