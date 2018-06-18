#include <eosiolib/eosio.hpp>
using namespace eosio;

class decentwitter : public eosio::contract {
  public:
      using contract::contract;

      /// @abi action 
      void tweet( string msg) {}
      /// @abi action
      void reply(string id, string msg) {}
      /// @abi action
      void setAvatar(string msg) {}
};

EOSIO_ABI( decentwitter, (tweet)(reply)(setAvatar) )
