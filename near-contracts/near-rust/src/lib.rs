use near_sdk::{
  borsh::{ self, BorshDeserialize, BorshSerialize },
  near_bindgen,
  serde_json
};

use std::collections::HashMap;


#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
  //Variables
  _dao_ids: i32,
  _goal_ids: i32,
  _ideas_ids: i32,
  _ideas_vote_ids: i32,

  //Variables Multiples
   _dao_uris: HashMap<i32, Vec<String>>,                    //_dao_ids          => (Dao)    Dao Wallet + Dao URI   + Finished
   _goal_uris: HashMap<i32, Vec<String>>,                   //_goal_ids         => (Goal)   Dao ID + Goal URI          
   _ideas_uris: HashMap<i32, Vec<String>>,                  //_ideas_ids        => (Ideas)  Goal ID + Ideas URI          
   all_goal_ideas_votes: HashMap<i32, Vec<String>>,         //_ideas_vote_ids   => (Vote)   Goal ID + Ideas ID + Wallet          
  
}

impl Default for Contract {
  fn default() -> Self {
    Self {
      //Variables
      _dao_ids : 0,
      _goal_ids : 0,
      _ideas_ids : 0,
      _ideas_vote_ids : 0,

      //Variables Multiples
      _dao_uris: HashMap::new(), 
      _goal_uris: HashMap::new(), 
      _ideas_uris: HashMap::new(), 
      all_goal_ideas_votes: HashMap::new(), 
    }
  }
}



#[near_bindgen]
impl Contract {
 
  //Daos
  pub fn create_dao(&mut self, _dao_wallet: String, _dao_uri: String) -> i32 {
    let mut stuff : Vec<String> = Vec::new();
    stuff.push(_dao_wallet.to_string());
    stuff.push(_dao_uri.to_string());
    stuff.push("False".to_string());

    self._dao_uris.insert(self._dao_uris.len() as i32,stuff);
    self._dao_ids += 1;
    return self._dao_ids ;
  }

  pub fn set_dao(&mut self, _dao_id: &i32, _dao_wallet: String,_dao_uri: String) {
    self._dao_uris.get_mut(_dao_id).unwrap()[0] = (*_dao_wallet).to_string();
    self._dao_uris.get_mut(_dao_id).unwrap()[1] = (*_dao_uri).to_string(); 
  }


  pub fn get_all_daos(&self)-> String{
    let json = serde_json::to_string(&self._dao_uris).unwrap();
    return json;
  }
  pub fn get_all_daos_from_wallet(&self,wallet:String)-> String{
    let mut stuff : Vec<String> = Vec::new(); 
    for  (_k, v) in self._dao_uris.iter() {
      if  v[0].to_string() == wallet.to_string() {
        stuff.push(v[1].to_string());
      }
    }    
    let json = serde_json::to_string(&stuff).unwrap();
    return json;
  }


  pub fn dao_uri(&self,dao_id:&i32)-> String{
    let json = serde_json::to_string(&self._dao_uris.get(dao_id)).unwrap();
    return json;
  }

  //Goals

  pub fn create_goal(&mut self, _goal_uri: String,_dao_id:&i32) -> i32 {
    let mut stuff : Vec<String> = Vec::new();
    stuff.push(_dao_id.to_string());
    stuff.push(_goal_uri.to_string());

    self._goal_uris.insert(self._goal_uris.len() as i32,stuff);
    self._goal_ids += 1;
    return self._goal_ids ;
  }

  pub fn set_goal(&mut self, _goal_id: &i32,_goal_uri: String) {
    self._goal_uris.get_mut(_goal_id).unwrap()[1] = (*_goal_uri).to_string(); 
  }


  pub fn get_all_goals(&self)-> String{
    let json = serde_json::to_string(&self._goal_uris).unwrap();
    return json;
  }

  pub fn get_all_goals_by_dao_id(&self, _dao_id: &i32)-> String{
    let mut stuff : HashMap<i32,String> = HashMap::new(); 
    for  (_k, v) in self._goal_uris.iter() {
      if  v[0].to_string() == _dao_id.to_string() {
        stuff.insert(*_k,v[1].to_string());
      }
    }    
    let json = serde_json::to_string(&stuff).unwrap();
    return json;
  }

  pub fn goal_uri(&self,goal_id:&i32)-> String{
    let json = serde_json::to_string(&self._goal_uris.get(goal_id)).unwrap();
    return json;
  }

 //Ideas

 pub fn create_ideas(&mut self, _ideas_uri: String,_goal_id:&i32) -> i32 {
  let mut stuff : Vec<String> = Vec::new();
  stuff.push(_goal_id.to_string());
  stuff.push(_ideas_uri.to_string());

  self._ideas_uris.insert(self._ideas_uris.len() as i32,stuff);
  self._ideas_ids += 1;
  return self._ideas_ids ;
}

pub fn set_ideas(&mut self, _ideas_id: &i32,_ideas_uri: String) {
  self._ideas_uris.get_mut(_ideas_id).unwrap()[1] = (*_ideas_uri).to_string(); 
}


pub fn get_all_ideas(&self)-> String{
  let json = serde_json::to_string(&self._ideas_uris).unwrap();
  return json;
}

pub fn get_all_ideas_by_goal_id(&self, _goal_id: &i32)-> String{
  let mut stuff : HashMap<i32,String> = HashMap::new(); 
  for  (_k, v) in self._ideas_uris.iter() {
    if  v[0].to_string() == _goal_id.to_string() {
      stuff.insert(*_k,v[1].to_string());
    }
  }    
  let json = serde_json::to_string(&stuff).unwrap();
  return json;
}

pub fn ideas_uri(&self,ideas_id:&i32)-> String{
  let json = serde_json::to_string(&self._ideas_uris.get(ideas_id)).unwrap();
  return json;
}


  //Voting
  pub fn create_goal_ideas_vote(&mut self, goal_id: &i32,ideas_id: &i32,wallet: String ) -> i32 {
    let mut stuff : Vec<String> = Vec::new();
    stuff.push(goal_id.to_string());
    stuff.push(ideas_id.to_string());
    stuff.push(wallet.to_string());
  
    self.all_goal_ideas_votes.insert(self.all_goal_ideas_votes.len() as i32,stuff);
    self._ideas_vote_ids += 1;
    return self._ideas_vote_ids ;
  }
  pub fn get_ideas_votes_from_goal(&self, goal_id: &i32,ideas_id: &i32)->String{
     //Filtering all the Votes by containing Grant id and ideas id
     let new: HashMap<&i32, &Vec<String>> =  self.all_goal_ideas_votes.iter()
     .filter(|(_id, value)| value[0].to_string() == goal_id.to_string() && value[1].to_string() == ideas_id.to_string() ).collect();
   
     //Getting only the Vote URIs from the filtered
     let vote_uris_list:Vec<&String> = new.iter().map(|(_id,value)| {return &value[2]} ).collect();
  
     return serde_json::to_string(&vote_uris_list).unwrap();
  }


//Contract
pub fn reset_all(&mut self) {  
  self._dao_ids = 0;

  //Variables
  self._dao_uris = HashMap::new();
}


}
  


#[cfg(test)]

// All Tests
#[test]
fn test_create_dao() {
    let mut contract = Contract::default();
  
    contract.create_dao(String::from("account1.wallet"),String::from("Dao metadata #1"));
 
    // println!(" Dao 0 => {:#?}",contract.get_all_daos());
    // let get_dao_uri = contract._dao_uris.get(&0);    
  }
  
  #[test]
  fn test_create_goal() {
      let mut contract = Contract::default();
    
      contract.create_goal(String::from("Goal metadata #1"),&0);
      contract.create_goal(String::from("Goal metadata #2"),&1);
   
      // println!("Goals => {:#?}",contract.get_all_goals_by_dao_id(&1));
      // let get_dao_uri = contract._dao_uris.get(&0);    
    }
    
  