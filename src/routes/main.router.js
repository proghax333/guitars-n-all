
import express from "express";
import { db, QueryTypes } from "../models/models.js";

const mainRouter = express.Router();

mainRouter.get("/", async (req, res, next) => {
  return res.render("pages/index");
});

mainRouter.get("/shop", async (req, res, next) => {
  try {
    const products = await db.query(`
      select id, name, features, image from products;
    `);

    if(products.length > 0) {
      const [guitars] = products;

      return res.render("pages/shop", {
        data: {
          guitars
        }
      });
    } else {
      
    }

  } catch (error) {

  }

  return res.render("pages/shop", {
    data: {}
  });
});

mainRouter.get("/products/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await db.query(`
      select id, name, description, features, image
      from products
      where id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if(result.length > 0) {
      // Product was found
      const product = result[0];

      return res.render("pages/products/product-page", {
        data: {
          product
        }
      });
    } else {
      // Product was not found
    }
  } catch (error) {

  }

  return res.render("pages/products/product-page", {
    data: {}
  });
});


mainRouter.get("/posters", async (req, res, next) => {
  const static_posters = [
    "https://imgs.search.brave.com/1RlcGleg2mWiBYHeeim6OFhUays1DNYCh6rnngPnNsg/rs:fit:1078:1200:1/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzgxLzkx/LzlkLzgxOTE5ZDhm/ZDY1NWZmNzI2NzBl/MDVkMTY0OGMyYmVk/LmpwZw",
    "https://imgs.search.brave.com/T0jjkT4l4kK9R13e7fyChuDMvhwAjWDfhmaZxbr_4fs/rs:fit:735:525:1/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vNzM2/eC9mYS9hNi83NC9m/YWE2NzRmYjI1YTY5/ZGE5OGUxOGU3NTRl/ZjNiODMwMi5qcGc",
    "https://imgs.search.brave.com/QaIYpRJn0Wi7JaQzHbm9ejWx9LarglBHbalNyIrjFtY/rs:fit:600:600:1/g:ce/aHR0cHM6Ly9ybHYu/emNhY2hlLmNvbS5h/dS90aHJlZV9jb2xv/cmVkX2d1aXRhcnNf/cG9zdGVyLXI0NTlh/NmFkOGE1OTE0MmI3/YjI4OTIzNTVlOWU2/Nzg1Ml93djRfOGJ5/dnJfNjAwLmpwZw",
    "https://imgs.search.brave.com/oLEz_4ptplvS7-cCrQtK362aoGFfRJTiMoyQkhgFY4E/rs:fit:800:1028:1/g:ce/aHR0cHM6Ly9wNy5o/aWNsaXBhcnQuY29t/L3ByZXZpZXcvNjg3/LzUzNS82MjMvZWxl/Y3RyaWMtZ3VpdGFy/LWdydW5nZS1wb3N0/ZXItdmVjdG9yLWFy/dC1ndWl0YXIuanBn",
    "https://imgs.search.brave.com/sn9jkkBqpgU0BerHb42tXk-3u3USeWzZ4V4MRzOKLgM/rs:fit:1152:1200:1/g:ce/aHR0cHM6Ly9qZW5p/ZmVyc2hvcC5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjEv/MDUvaWxfZnVsbHhm/dWxsLjE0MDc2NDk1/NTlfcDhoZy1zY2Fs/ZWQtMS0xMTUyeDE1/MzYuanBn",
    "https://imgs.search.brave.com/oCbgky4-cKcKrrjww1OSE09I1Kb6NMpnjPVB7p_26r0/rs:fit:1125:1200:1/g:ce/aHR0cHM6Ly9kZWNv/cnlvdXJob21lLnN0/b3JlL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDE5LzExL2lsX2Z1/bGx4ZnVsbC40ODQz/MjA0MTBfaGlzMy5q/cGc",
    "https://imgs.search.brave.com/6VPidldUASCyv076Dl-TyI1v5vmqPXca1PfTCYJtVWw/rs:fit:709:709:1/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzc5L2Iz/LzAwLzc5YjMwMDk3/NjdiYTdlZTkzMzJj/YjYwOWMwZTE5MTZk/LmpwZw",
    "https://imgs.search.brave.com/9UqRrzskMQ0S2UrgmIwohnCkllYlWrpGIifLF5Ojb2g/rs:fit:800:534:1/g:ce/aHR0cHM6Ly9paDEu/cmVkYnViYmxlLm5l/dC9pbWFnZS4xNjMy/MzI1MS4wNTA2L2Zs/YXQsODAweDgwMCww/NzAsZi51MS5qcGc",
  ];

  return res.render("pages/posters", {
    posters: static_posters,
  });
});

// Logout
mainRouter.get("/logout", async (req, res, next) => {
  await req.session.destroy();

  return res.redirect("/");
});

// Login
mainRouter.get("/login", async (req, res, next) => {
  return res.render("pages/login", {
    errors: null,
  });
});

mainRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  let errors = {};

  try {
    const profiles = await db.query(
      `
        select
          A.username, A.id as account_id,
          P.id as profile_id, P.name, P.type

        from accounts as A
        inner join profiles as P
        on (P.account_id = A.id)

        where username = :username AND password = :password;
      `,
      {
        replacements: {
          username,
          password,
        },
        type: QueryTypes.SELECT
      }
    );

    if(profiles.length === 0) {
      errors.message = "Invalid username/password entered.";
    } else {
      const defaultProfile = profiles[0];
      
      const auth = {
        account_id: defaultProfile.account_id,
        profile_id: defaultProfile.profile_id,
        username: defaultProfile.username,
      };

      console.log(auth);

      req.session.auth = auth;
      await req.session.save();

      return res.redirect("/");
    }
  } catch (error) {

  }

  return res.render("pages/login", {
    flash: {
      errors,
    }
  });
});



// Sign up
mainRouter.get("/signup", async (req, res, next) => {
  return res.render("pages/signup");
});

mainRouter.post("/signup", async (req, res, next) => {
  let { username, password, phone_number, name, description } = req.body;

  if(!description) {
    description = "";
  }

  let errors = {};

  const t = await db.transaction();
  let accountId, profileId;

  try {
    [accountId] = await db.query(
      `
        insert into accounts
          (username, password, phone_number, created_at, updated_at)
        values
          (:username, :password, :phone_number, now(), now());
      `,
      {
        replacements: {
          username,
          password,
          phone_number,
        },
        type: QueryTypes.INSERT,
        transaction: t,
      }
    );

    [profileId] = await db.query(
      `
        insert into profiles
          (name, description, account_id, created_at, updated_at)
        values
          (:name, :description, :account_id, now(), now());
      `,
      {
        replacements: {
          name,
          description,
          account_id: accountId,
        },
        type: QueryTypes.INSERT,
        transaction: t,
      }
    );

    console.log(accountId);
    console.log(profileId);

    
    await t.commit();

    // Log the user in    
    const auth = {
      account_id: accountId,
      profile_id: profileId,
      username: username,
    };

    console.log(auth);

    req.session.auth = auth;
    await req.session.save();

    return res.redirect("/");

  } catch (error) {
    console.log(error);
    await t.rollback();
  }

  return res.render("pages/signup", {
    flash: {
      errors: {
        message: "Could not sign up at this moment",
      }
    }
  })
});

mainRouter.get("/about", async (req, res, next) => {
  return res.render("pages/about");
});

export default mainRouter;
