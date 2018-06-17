#include <eosiolib/eosio.hpp>
using namespace eosio;

class decentwitter : public eosio::contract {
  public:
      using contract::contract;

      /// @abi action 
      void tweet( string msg ) {
         //print( "Hello, ", name{user} );
      }
};

EOSIO_ABI( decentwitter, (tweet) )
