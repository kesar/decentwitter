#include <eosiolib/eosio.hpp>
using namespace eosio;

class decentwitter : public eosio::contract {
  public:
      using contract::contract;
      void tweet(std::string msg) {}
      void reply(std::string id, std::string msg) {}
      void avatar(std::string msg) {}
};

EOSIO_ABI( decentwitter, (tweet)(reply)(avatar) )
