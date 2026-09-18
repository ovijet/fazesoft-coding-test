WITH customer_spending AS (
    SELECT 
        u.id AS user_id,
        u.name,
        EXTRACT(YEAR FROM u.created_at) AS registration_year,
        COUNT(o.id) AS order_count,
        SUM(o.total_amount) AS total_spent
    FROM 
        users u
    JOIN 
        orders o ON u.id = o.user_id
    WHERE 
        o.status = 'completed'
    GROUP BY 
        u.id, u.name, u.created_at
    HAVING 
        COUNT(o.id) >= 2
),
ranked_customers AS (
    SELECT 
        registration_year,
        user_id,
        name,
        order_count,
        total_spent,
        DENSE_RANK() OVER (
            PARTITION BY registration_year 
            ORDER BY total_spent DESC
        ) AS user_rank
    FROM 
        customer_spending
)
SELECT 
    registration_year,
    user_id,
    name,
    order_count,
    total_spent,
    user_rank
FROM 
    ranked_customers
WHERE 
    user_rank <= 2
ORDER BY 
    registration_year ASC,
    user_rank ASC,
    total_spent DESC;